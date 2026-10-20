import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import agents, { imageUrl } from "../../api/movie_agent";
import { pickTrailer, year } from "../../utils/format";
import RatingBadge from "./RatingBadge";
import TrailerDialog from "./TrailerDialog";
import { WatchlistButton } from "./LibraryButtons";

const ROTATE_MS = 8000;

export default function HeroBanner({ movies, loading }) {
    const slides = (movies || []).filter(m => m.backdrop_path).slice(0, 6);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [trailer, setTrailer] = useState({ open: false, video: null });

    useEffect(() => {
        if (paused || slides.length < 2) return undefined;
        const t = setTimeout(() => setIndex(i => (i + 1) % slides.length), ROTATE_MS);
        return () => clearTimeout(t);
    }, [index, paused, slides.length]);

    if (loading || slides.length === 0) {
        return <Skeleton variant="rectangular" sx={{ height: { xs: 460, md: 620 }, mx: { xs: -2, sm: -3 } }} />;
    }

    const movie = slides[index % slides.length];

    const playTrailer = async () => {
        setTrailer({ open: true, video: null });
        try {
            const videos = await agents.Movies.videos(movie.id);
            setTrailer({ open: true, video: pickTrailer(videos) });
        } catch (_e) {
            setTrailer({ open: true, video: null });
        }
    };

    return (
        <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{
                position: 'relative',
                height: { xs: 480, md: 640 },
                mx: { xs: -2, sm: -3 },
                overflow: 'hidden',
            }}
        >
            {slides.map((m, i) => (
                <Box
                    key={m.id}
                    component="img"
                    src={imageUrl(m.backdrop_path, 'w1280')}
                    alt=""
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        opacity: i === index ? 1 : 0,
                        transform: i === index ? 'scale(1.04)' : 'scale(1)',
                        transition: 'opacity 1s ease, transform 8s linear',
                    }}
                />
            ))}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(11,13,18,.95) 0%, rgba(11,13,18,.6) 45%, rgba(11,13,18,0) 75%), linear-gradient(0deg, #0b0d12 0%, rgba(11,13,18,0) 40%)',
            }} />
            <Stack
                spacing={2}
                sx={{
                    position: 'absolute',
                    left: { xs: 16, sm: 24, md: 56 },
                    right: 16,
                    bottom: { xs: 48, md: 96 },
                    maxWidth: 640,
                }}
            >
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                    Trending now
                </Typography>
                <Typography variant="h2" component="h1" sx={{ textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>
                    {movie.title}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <RatingBadge vote={movie.vote_average} size={44} />
                    <Typography color="text.secondary">{year(movie.release_date)}</Typography>
                </Stack>
                <Typography
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {movie.overview}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pt: 1 }}>
                    <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={playTrailer}>
                        Trailer
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        startIcon={<InfoIcon />}
                        component={RouterLink}
                        to={`/movie/${movie.id}`}
                    >
                        More info
                    </Button>
                    <WatchlistButton movie={movie} sx={{ border: '1px solid rgba(255,255,255,.3)' }} />
                </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: { xs: 20, md: 48 }, left: { xs: 16, sm: 24, md: 56 } }}>
                {slides.map((m, i) => (
                    <Box
                        key={m.id}
                        component="button"
                        aria-label={`Show ${m.title}`}
                        onClick={() => setIndex(i)}
                        sx={{
                            width: i === index ? 28 : 10,
                            height: 10,
                            p: 0,
                            border: 0,
                            borderRadius: 5,
                            cursor: 'pointer',
                            bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,.35)',
                            transition: 'all .3s',
                        }}
                    />
                ))}
            </Stack>
            <TrailerDialog
                open={trailer.open}
                video={trailer.video}
                onClose={() => setTrailer({ open: false, video: null })}
            />
        </Box>
    );
}
