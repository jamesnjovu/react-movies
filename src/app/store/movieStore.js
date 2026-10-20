import { makeAutoObservable } from "mobx";

const KEYS = {
    favorites: 'cinescope:favorites',
    watchlist: 'cinescope:watchlist',
    recent: 'cinescope:recent',
};
const LEGACY_LIKED_KEY = 'bptn-Liked1-movie';
const MAX_RECENT = 20;

// Only keep what the cards need, so localStorage stays small.
const slim = (movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
});

const read = (key) => {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : null;
    } catch (_e) {
        return null;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (_e) {
        // Storage can be unavailable (private mode, quota); the in-memory state still works.
    }
};

export default class MovieStore {
    favorites = [];
    watchlist = [];
    recent = [];
    toast = null;

    constructor() {
        makeAutoObservable(this);
        this.load();
        window.addEventListener('storage', (e) => {
            if (Object.values(KEYS).includes(e.key)) this.load();
        });
    }

    load = () => {
        // Liked movies from the previous version of the app become favorites.
        this.favorites = (read(KEYS.favorites) || read(LEGACY_LIKED_KEY) || []).map(slim);
        this.watchlist = read(KEYS.watchlist) || [];
        this.recent = read(KEYS.recent) || [];
    }

    notify = (message) => {
        this.toast = { message, key: Date.now() };
    }

    clearToast = () => {
        this.toast = null;
    }

    isFavorite = (id) => this.favorites.some(m => m.id === id);

    isInWatchlist = (id) => this.watchlist.some(m => m.id === id);

    toggleFavorite = (movie) => {
        if (this.isFavorite(movie.id)) {
            this.favorites = this.favorites.filter(m => m.id !== movie.id);
            this.notify(`Removed "${movie.title}" from favorites`);
        } else {
            this.favorites = [slim(movie), ...this.favorites];
            this.notify(`Added "${movie.title}" to favorites`);
        }
        write(KEYS.favorites, this.favorites);
    }

    toggleWatchlist = (movie) => {
        if (this.isInWatchlist(movie.id)) {
            this.watchlist = this.watchlist.filter(m => m.id !== movie.id);
            this.notify(`Removed "${movie.title}" from your watchlist`);
        } else {
            this.watchlist = [slim(movie), ...this.watchlist];
            this.notify(`Added "${movie.title}" to your watchlist`);
        }
        write(KEYS.watchlist, this.watchlist);
    }

    addRecent = (movie) => {
        this.recent = [slim(movie), ...this.recent.filter(m => m.id !== movie.id)].slice(0, MAX_RECENT);
        write(KEYS.recent, this.recent);
    }

    clearList = (list) => {
        this[list] = [];
        write(KEYS[list], []);
    }
}
