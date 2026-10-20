/**
 * TMDB proxy for Cloudflare Workers.
 *
 * The browser calls this worker instead of api.themoviedb.org. The worker adds the
 * TMDB credentials (stored as an encrypted Cloudflare secret) and forwards the request,
 * so the key never ships in the public GitHub Pages bundle.
 *
 * Protections:
 *  - Only GET requests to an allowlist of read-only TMDB endpoints are forwarded.
 *  - Only origins listed in ALLOWED_ORIGINS get CORS access (stops other sites from
 *    using your proxy from a browser).
 *  - Responses are cached at the edge to stay well within TMDB's rate limits.
 *
 * Secrets / vars (see wrangler.toml and the README):
 *  - TMDB_API_KEY      v3 API key            (wrangler secret put TMDB_API_KEY)
 *    or TMDB_READ_TOKEN v4 read access token (wrangler secret put TMDB_READ_TOKEN)
 *  - ALLOWED_ORIGINS   comma separated list, e.g. "https://jamesnjovu.github.io,http://localhost:3000"
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';

const ALLOWED_PATHS = [
    /^\/trending\/(movie|all|person)\/(day|week)$/,
    /^\/movie\/(popular|now_playing|top_rated|upcoming)$/,
    /^\/movie\/\d+$/,
    /^\/movie\/\d+\/(videos|credits|recommendations|similar|images|release_dates|watch\/providers|reviews)$/,
    /^\/person\/\d+$/,
    /^\/person\/\d+\/(movie_credits|images)$/,
    /^\/discover\/movie$/,
    /^\/search\/(movie|person|multi)$/,
    /^\/genre\/movie\/list$/,
    /^\/configuration$/,
];

const CACHE_SECONDS = 60 * 30;

const allowedOrigins = (env) => (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

const corsHeaders = (origin) => ({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
});

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
});

export default {
    async fetch(request, env, ctx) {
        const origin = request.headers.get('Origin') || '';
        const origins = allowedOrigins(env);
        const originAllowed = origins.includes('*') || origins.includes(origin);

        // Browsers always send Origin on cross-origin requests; reject unknown sites.
        if (origin && !originAllowed) {
            return json(403, { status_message: 'Origin not allowed' });
        }
        const cors = origin ? corsHeaders(origin) : {};

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }
        if (request.method !== 'GET') {
            return json(405, { status_message: 'Method not allowed' }, cors);
        }

        const url = new URL(request.url);
        const path = url.pathname.replace(/\/+$/, '').replace(/^\/3(?=\/)/, '');
        if (!ALLOWED_PATHS.some(re => re.test(path))) {
            return json(404, { status_message: 'Not found' }, cors);
        }
        if (!env.TMDB_API_KEY && !env.TMDB_READ_TOKEN) {
            return json(500, { status_message: 'Proxy is missing TMDB credentials' }, cors);
        }

        // Rebuild the query string, dropping anything that tries to set credentials.
        const upstream = new URL(TMDB_BASE + path);
        url.searchParams.forEach((value, key) => {
            if (key !== 'api_key') upstream.searchParams.set(key, value);
        });
        upstream.searchParams.sort();

        // Cache on the credential-free URL so the key never ends up in a cache key.
        const cache = caches.default;
        const cacheKey = new Request(upstream.toString(), { method: 'GET' });
        let response = await cache.match(cacheKey);

        if (!response) {
            const headers = { Accept: 'application/json' };
            if (env.TMDB_READ_TOKEN) {
                headers.Authorization = `Bearer ${env.TMDB_READ_TOKEN}`;
            } else {
                upstream.searchParams.set('api_key', env.TMDB_API_KEY);
            }
            const tmdb = await fetch(upstream.toString(), { headers });
            response = new Response(tmdb.body, {
                status: tmdb.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': tmdb.ok ? `public, max-age=${CACHE_SECONDS}` : 'no-store',
                },
            });
            if (tmdb.ok) ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }

        const out = new Response(response.body, response);
        Object.entries(cors).forEach(([k, v]) => out.headers.set(k, v));
        return out;
    },
};
