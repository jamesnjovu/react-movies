import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import MovieCard, { MovieCardSkeleton } from "./MovieCard";

const gridSx = {
    display: 'grid',
    gridTemplateColumns: {
        xs: 'repeat(2, minmax(0, 1fr))',
        sm: 'repeat(3, minmax(0, 1fr))',
        md: 'repeat(4, minmax(0, 1fr))',
        lg: 'repeat(6, minmax(0, 1fr))',
    },
    gap: { xs: 2, md: 3 },
};

// Responsive grid of movie cards with optional infinite scrolling.
export default function MovieGrid({ items, loading, hasMore, onLoadMore }) {
    const sentinel = useRef(null);

    useEffect(() => {
        const el = sentinel.current;
        if (!el || !hasMore || !onLoadMore || !('IntersectionObserver' in window)) return undefined;
        const observer = new IntersectionObserver(
            (entries) => entries[0].isIntersecting && onLoadMore(),
            { rootMargin: '600px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, onLoadMore]);

    const initialLoading = loading && items.length === 0;

    return (
        <>
            <Box sx={gridSx}>
                {initialLoading
                    ? Array.from({ length: 12 }, (_, i) => <MovieCardSkeleton key={i} />)
                    : items.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </Box>
            {onLoadMore && (
                <Box ref={sentinel} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    {loading && items.length > 0 && <CircularProgress size={28} />}
                    {!loading && hasMore && (
                        <Button variant="outlined" onClick={onLoadMore}>Load more</Button>
                    )}
                </Box>
            )}
        </>
    );
}
