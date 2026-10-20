import axios from "axios";

// Two ways to reach TMDB:
//  1. REACT_APP_TMDB_PROXY_URL - a small proxy (see /worker) that keeps the API key
//     on the server. Use this for anything deployed (e.g. GitHub Pages).
//  2. REACT_APP_API_KEY - the key is sent straight from the browser. Only use this
//     for local development: anything in a static bundle is visible to everyone.
const PROXY_URL = (process.env.REACT_APP_TMDB_PROXY_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.REACT_APP_API_KEY;

export const isConfigured = Boolean(PROXY_URL || API_KEY);

const request = axios.create({
    baseURL: PROXY_URL || 'https://api.themoviedb.org/3',
    params: PROXY_URL ? {} : { api_key: API_KEY },
    timeout: 15000,
});

const get = (url, params = {}) => request.get(url, { params }).then(res => res.data);

const IMG_BASE = 'https://image.tmdb.org/t/p/';

export const imageUrl = (path, size = 'w500') => (path ? `${IMG_BASE}${size}${path}` : null);

export const CATEGORIES = {
    trending: { title: 'Trending This Week', path: '/trending/movie/week' },
    popular: { title: 'Popular', path: '/movie/popular' },
    now_playing: { title: 'Now Playing', path: '/movie/now_playing' },
    top_rated: { title: 'Top Rated', path: '/movie/top_rated' },
    upcoming: { title: 'Upcoming', path: '/movie/upcoming' },
};

const Movies = {
    category: (key, page = 1) => get(CATEGORIES[key].path, { page }),
    discover: (params) => get('/discover/movie', { include_adult: false, ...params }),
    search: (query, page = 1) => get('/search/movie', { query, page, include_adult: false }),
    genres: () => get('/genre/movie/list').then(data => data.genres),
    videos: (id) => get(`/movie/${id}/videos`).then(data => data.results),
    details: (id) => get(`/movie/${id}`, {
        append_to_response: 'videos,credits,recommendations,similar,release_dates,watch/providers',
    }),
};

const People = {
    details: (id) => get(`/person/${id}`, { append_to_response: 'movie_credits' }),
};

const agents = {
    Movies,
    People,
};

export default agents;
