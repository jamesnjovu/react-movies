# CineScope 🎬

A movie discovery app built with React, MUI and MobX on top of the [TMDB API](https://developer.themoviedb.org/), deployed to GitHub Pages.

**Live:** https://jamesnjovu.github.io/react-movies

## Features

- **Home** – rotating hero with trending movies and trailers, genre shortcuts, and rows for Trending, Popular, Now Playing, Top Rated and Upcoming
- **Search** – live, debounced search from the header with infinite scrolling results
- **Discover** – filter by genre, release year and minimum rating, and sort by popularity, rating, newest, box office or title. Filters live in the URL, so you can share them.
- **Movie details** – backdrop hero, certification, runtime, genres, user score, tagline, director and writers, an in-app YouTube trailer, top cast, recommendations, where to watch (streaming, rent or buy for your region), budget, revenue and more
- **Watch full movies (legally)**
  - Public-domain classics play in the app through the [Internet Archive](https://archive.org/details/feature_films) player ("Watch full movie · Free"), and a *Free Classics* row on the home page lists them.
  - For everything else, a "Watch now" button opens the best legal option in your region (free with ads, subscription, rent or buy), using TMDB / JustWatch data.
  - A *Free to Stream* row and a "Where to watch" filter on Discover help find movies you can watch at no cost.
- **People** – biography, age, place of birth and full filmography for cast and crew
- **My Library** – favorites, watchlist and recently viewed movies, saved in your browser and synced across tabs. Liked movies from the old version move into favorites automatically.
- Dark, responsive UI with skeleton loaders, error and empty states, toasts, a share button and keyboard-accessible controls
- Hash-based routing (`/#/movie/123`), so deep links and page refreshes work on GitHub Pages

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in one of the options
npm start
```

## 🔐 Keeping your TMDB API key secret

GitHub Pages only serves static files. **Anything the React app knows at build time (every `REACT_APP_*` variable) ends up in the public JavaScript bundle.** Anyone can read it in DevTools. Storing it as a GitHub Secret doesn't help on its own, because the build still writes the key into the bundle.

The only real fix is to keep the key on a server. This repo includes a tiny proxy in [`worker/`](worker/) that runs on **Cloudflare Workers** (the free tier is plenty):

```
Browser ──> tmdb-proxy.<you>.workers.dev ──(adds the secret key)──> api.themoviedb.org
```

The proxy:

- stores the key as an encrypted Cloudflare secret, so it is never in git or the bundle
- only forwards `GET` requests to the read-only TMDB endpoints the app uses
- only allows CORS from the origins you list, so other websites can't use it from a browser
- caches responses at the edge for 30 minutes, which keeps you well under TMDB's rate limits

### 1. Rotate your old key

A TMDB key was committed to this repository's git history earlier, so treat it as public. Go to **TMDB → Settings → API** and regenerate the key, then use the new one below.

### 2. Deploy the proxy

```bash
cd worker
npx wrangler login
npx wrangler secret put TMDB_API_KEY     # paste your new v3 API key
# (or: npx wrangler secret put TMDB_READ_TOKEN  for the v4 read access token)
npx wrangler deploy
```

Wrangler prints the worker URL, e.g. `https://tmdb-proxy.<your-subdomain>.workers.dev`.
Edit `ALLOWED_ORIGINS` in [`worker/wrangler.toml`](worker/wrangler.toml) if your site lives somewhere other than `https://jamesnjovu.github.io`.

Optional hardening: in the Cloudflare dashboard, add a **Rate limiting rule** for the worker route, e.g. 100 requests per minute per IP.

### 3. Point the app at the proxy

- **Locally:** put `REACT_APP_TMDB_PROXY_URL=https://tmdb-proxy.<your-subdomain>.workers.dev` in `.env.local`
- **GitHub Pages:** go to **Settings → Secrets and variables → Actions** and add `TMDB_PROXY_URL` with the worker URL, either as a repository variable or as a repository secret (both work)

The proxy URL is not a secret. Anyone can see it, but without your key and outside your allowed origins it's useless to them.

## Deploying to GitHub Pages

### Option A: GitHub Actions (recommended)

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the app on every push to `main` and publishes it to the `gh-pages` branch.

1. **Settings → Pages → Build and deployment → Source:** choose **Deploy from a branch**, then pick `gh-pages` / `(root)`
2. Add the `TMDB_PROXY_URL` repository variable (see above)
3. Push to `main`, or run the workflow by hand from the Actions tab

### Option B: from your machine

```bash
REACT_APP_TMDB_PROXY_URL=https://tmdb-proxy.<your-subdomain>.workers.dev npm run deploy
```

This builds and pushes to the same `gh-pages` branch from your machine.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the dev server at http://localhost:3000 |
| `npm run build` | Build a production bundle into `build/` |
| `npm run deploy` | Build and publish to the `gh-pages` branch |
| `npm test` | Run tests |

## Project structure

```
src/app/
  api/movie_agent.js        TMDB client (proxy or direct key)
  store/                    MobX store: favorites, watchlist, recently viewed, toasts
  hooks/useAsync.js         data fetching, pagination, debounce, document title
  layout/components/        header, hero, cards, rows, grid, trailer dialog, ...
  layout/main/              pages: Home, Discover, Search, Category, MovieDetails, PersonDetails, Library
worker/                     Cloudflare Worker TMDB proxy
```

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
