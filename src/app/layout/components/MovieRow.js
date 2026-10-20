import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import MovieCard, { MovieCardSkeleton } from "./MovieCard";

const arrowSx = {
    display: { xs: 'none', md: 'inline-flex' },
    bgcolor: 'rgba(255,255,255,.06)',
    '&:hover': { bgcolor: 'rgba(255,255,255,.14)' },
};

// A horizontally scrolling row of movies. Pass `items` to render cards, or any
// custom children (e.g. cast cards) with `children`.
export default function MovieRow({ title, items, loading, seeAllTo, children, action }) {
    const scroller = useRef(null);

    const scroll = (dir) => {
        const el = scroller.current;
        if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
    };

    if (!loading && !children && (!items || items.length === 0)) return null;

    return (
        <Box component="section" sx={{ my: { xs: 3, md: 5 } }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>{title}</Typography>
                {action}
                {seeAllTo && (
                    <Button component={RouterLink} to={seeAllTo} size="small" endIcon={<ChevronRightIcon />}>
                        See all
                    </Button>
                )}
                <IconButton aria-label="Scroll left" size="small" onClick={() => scroll(-1)} sx={arrowSx}>
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton aria-label="Scroll right" size="small" onClick={() => scroll(1)} sx={arrowSx}>
                    <ChevronRightIcon />
                </IconButton>
            </Stack>
            <Box
                ref={scroller}
                sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: { xs: '38%', sm: '24%', md: '17%', lg: '13.2%' },
                    gap: { xs: 1.5, md: 2 },
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    pb: 1.5,
                    pt: 0.5,
                    '& > *': { scrollSnapAlign: 'start' },
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {children || (loading
                    ? Array.from({ length: 8 }, (_, i) => <MovieCardSkeleton key={i} />)
                    : items.map(movie => <MovieCard key={movie.id} movie={movie} />))}
            </Box>
        </Box>
    );
}
