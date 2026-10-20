import { Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import { Link as RouterLink } from "react-router-dom";
import { imageUrl } from "../../api/movie_agent";
import { year } from "../../utils/format";
import RatingBadge from "./RatingBadge";
import { FavoriteButton, WatchlistButton } from "./LibraryButtons";

export function PosterPlaceholder({ icon: Icon = MovieIcon }) {
    return (
        <Box sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: 'text.secondary',
            background: 'linear-gradient(135deg, #1d2130, #12141b)',
        }}>
            <Icon sx={{ fontSize: 48, opacity: 0.4 }} />
        </Box>
    );
}

export function MovieCardSkeleton() {
    return (
        <Box>
            <Skeleton variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: 2 }} />
            <Skeleton width="80%" sx={{ mt: 1 }} />
            <Skeleton width="40%" />
        </Box>
    );
}

export default function MovieCard({ movie }) {
    const poster = imageUrl(movie.poster_path, 'w342');

    return (
        <Box sx={{ minWidth: 0 }}>
            <Card
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    transition: 'transform .25s ease, box-shadow .25s ease',
                    '&:hover, &:focus-within': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,.55)',
                    },
                    '&:hover .card-actions, &:focus-within .card-actions': { opacity: 1 },
                }}
            >
                <CardActionArea component={RouterLink} to={`/movie/${movie.id}`} aria-label={movie.title}>
                    <Box sx={{ position: 'relative', aspectRatio: '2 / 3' }}>
                        {poster ? (
                            <Box
                                component="img"
                                src={poster}
                                alt=""
                                loading="lazy"
                                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : <PosterPlaceholder />}
                        <Box sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 35%)',
                        }} />
                        <RatingBadge vote={movie.vote_average} size={38} sx={{ position: 'absolute', left: 8, bottom: 8 }} />
                    </Box>
                </CardActionArea>
                <Box
                    className="card-actions"
                    sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity .2s',
                    }}
                >
                    <FavoriteButton movie={movie} size="small" sx={{ bgcolor: 'rgba(0,0,0,.6)', '&:hover': { bgcolor: 'rgba(0,0,0,.85)' } }} />
                    <WatchlistButton movie={movie} size="small" sx={{ bgcolor: 'rgba(0,0,0,.6)', '&:hover': { bgcolor: 'rgba(0,0,0,.85)' } }} />
                </Box>
            </Card>
            <Typography
                component={RouterLink}
                to={`/movie/${movie.id}`}
                variant="subtitle2"
                noWrap
                title={movie.title}
                sx={{ display: 'block', mt: 1, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
                {movie.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {year(movie.release_date) || 'TBA'}
            </Typography>
        </Box>
    );
}
