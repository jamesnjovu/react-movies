import axios from "axios";
import agents from "./movie_agent";

// Public-domain feature films from the Internet Archive (https://archive.org/details/feature_films).
// These are legal to stream and the Archive allows its player to be embedded.

const SEARCH_URL = 'https://archive.org/advancedsearch.php';
const BASE_QUERY = 'collection:(feature_films) AND mediatype:(movies)';
// Almost everything in the collection is old; skipping newer films avoids false matches.
const MAX_YEAR = 1995;
const CACHE_KEY = 'cinescope:archive';

export const embedUrl = (id) => `https://archive.org/embed/${encodeURIComponent(id)}`;
export const detailsUrl = (id) => `https://archive.org/details/${encodeURIComponent(id)}`;

const normalize = (title = '') => title
    .toLowerCase()
    .replace(/\(\s*\d{4}\s*\)/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const yearOf = (value) => parseInt(String(value || '').slice(0, 4), 10) || null;

// tmdbId -> archive identifier (or null when there is no copy), kept for the session.
const cache = (() => {
    try {
        return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (_e) {
        return {};
    }
})();

const remember = (tmdbId, archiveId) => {
    cache[tmdbId] = archiveId;
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (_e) {
        // Ignore storage errors; the lookup just runs again next time.
    }
};

const search = (q, rows) => axios.get(SEARCH_URL, {
    params: {
        q,
        fl: ['identifier', 'title', 'year', 'downloads'],
        sort: ['downloads desc'],
        rows,
        output: 'json',
    },
    timeout: 10000,
}).then(res => res.data.response.docs);

const sameMovie = (doc, title, year) => {
    if (normalize(doc.title) !== normalize(title)) return false;
    const docYear = yearOf(doc.year);
    return !docYear || !year || Math.abs(docYear - year) <= 1;
};

// Finds a full, public-domain copy of a TMDB movie. Resolves to an Archive identifier or null.
export async function findFullMovie(movie) {
    if (movie.id in cache) return cache[movie.id];
    const year = yearOf(movie.release_date);
    if (!year || year > MAX_YEAR) return null;

    const titles = [...new Set([movie.title, movie.original_title].filter(Boolean))];
    const quoted = titles.map(t => `"${t.replace(/["\\]/g, ' ')}"`).join(' OR ');
    try {
        const docs = await search(`${BASE_QUERY} AND title:(${quoted})`, 10);
        const match = docs.find(doc => titles.some(t => sameMovie(doc, t, year)));
        const id = match ? match.identifier : null;
        remember(movie.id, id);
        return id;
    } catch (_e) {
        // Archive unreachable: treat as "no free copy" without caching, so it retries later.
        return null;
    }
}

// Popular public-domain classics, matched to TMDB so they render like any other movie.
export async function freeClassics(limit = 20) {
    const docs = await search(`${BASE_QUERY} AND year:[1920 TO 1980]`, limit + 10);
    const matches = await Promise.all(docs.map(async (doc) => {
        const year = yearOf(doc.year);
        try {
            const data = await agents.Movies.search(doc.title.replace(/\(\s*\d{4}\s*\)/g, ''), 1, year);
            const movie = data.results.find(m => sameMovie({ title: m.title, year: m.release_date }, doc.title, year)
                || sameMovie({ title: m.original_title, year: m.release_date }, doc.title, year));
            if (movie) remember(movie.id, doc.identifier);
            return movie || null;
        } catch (_e) {
            return null;
        }
    }));
    const seen = new Set();
    return matches.filter(m => m && !seen.has(m.id) && seen.add(m.id)).slice(0, limit);
}
