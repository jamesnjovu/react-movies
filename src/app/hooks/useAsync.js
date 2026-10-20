import { useCallback, useEffect, useRef, useState } from "react";

// Runs an async function whenever `deps` change and tracks loading / error state.
export function useAsync(fn, deps) {
    const [state, setState] = useState({ data: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        setState(s => ({ ...s, loading: true, error: null }));
        fn()
            .then(data => active && setState({ data, loading: false, error: null }))
            .catch(error => active && setState({ data: null, loading: false, error }));
        return () => { active = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt]);

    const retry = useCallback(() => setAttempt(a => a + 1), []);
    return { ...state, retry };
}

// Loads TMDB paginated results page by page. `fetchPage(page)` must resolve to a
// TMDB list response ({ page, results, total_pages }).
export function usePaginated(fetchPage, deps) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const generation = useRef(0);
    const fetchRef = useRef(fetchPage);
    fetchRef.current = fetchPage;

    const load = useCallback((pageToLoad, reset) => {
        const current = ++generation.current;
        setLoading(true);
        setError(null);
        fetchRef.current(pageToLoad)
            .then(data => {
                if (current !== generation.current) return;
                setItems(prev => {
                    const base = reset ? [] : prev;
                    const seen = new Set(base.map(m => m.id));
                    return [...base, ...data.results.filter(m => !seen.has(m.id))];
                });
                setPage(data.page);
                setTotalPages(Math.min(data.total_pages, 500));
                setTotalResults(data.total_results);
                setLoading(false);
            })
            .catch(err => {
                if (current !== generation.current) return;
                setError(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setItems([]);
        load(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const loadMore = useCallback(() => {
        if (!loading && page < totalPages) load(page + 1, false);
    }, [loading, page, totalPages, load]);

    const retry = useCallback(() => load(items.length ? page + 1 : 1, !items.length), [load, items.length, page]);

    return { items, loading, error, loadMore, retry, totalResults, hasMore: page < totalPages };
}

// Debounces a changing value.
export function useDebounce(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} · CineScope` : 'CineScope · Discover movies';
    }, [title]);
}
