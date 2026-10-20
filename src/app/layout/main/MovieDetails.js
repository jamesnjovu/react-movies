import {
    Avatar, Box, Button, Chip, Divider, Grid, IconButton, Link, Skeleton, Stack, Tooltip, Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShareIcon from "@mui/icons-material/IosShare";
import PersonIcon from "@mui/icons-material/Person";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import agents, { imageUrl } from "../../api/movie_agent";
import { useAsync, useDocumentTitle } from "../../hooks/useAsync";
import { useStore } from "../../store/store";
import { languageName, longDate, money, pickTrailer, region, runtime, year } from "../../utils/format";
import { PosterPlaceholder } from "../components/MovieCard";
import MovieRow from "../components/MovieRow";
import RatingBadge from "../components/RatingBadge";
import TrailerDialog from "../components/TrailerDialog";
import { FavoriteButton, WatchlistButton } from "../components/LibraryButtons";
import { ErrorState } from "../components/StateViews";

const certification = (movie) => {
    const results = movie.release_dates?.results || [];
    const local = results.find(r => r.iso_3166_1 === region()) || results.find(r => r.iso_3166_1 === 'US');
    return local?.release_dates.find(d => d.certification)?.certification || '';
};

const roundButton = { border: '1px solid rgba(255,255,255,.25)', bgcolor: 'rgba(0,0,0,.3)' };

function CastCard({ person }) {
    return (
        <Box
            component={RouterLink}
            to={`/person/${person.id}`}
            sx={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', '&:hover .cast-name': { color: 'primary.main' } }}
        >
            <Avatar
                src={imageUrl(person.profile_path, 'w185') || undefined}
                alt={person.name}
                sx={{ width: '100%', height: 'auto', aspectRatio: '1', mb: 1, bgcolor: 'background.paper' }}
            >
                <PersonIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography className="cast-name" variant="subtitle2" noWrap>{person.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">{person.character}</Typography>
        </Box>
    );
}

function Providers({ providers }) {
    const local = providers?.results?.[region()] || providers?.results?.US;
    if (!local) return null;
    const groups = [
        ['Stream', local.flatrate],
        ['Rent', local.rent],
        ['Buy', local.buy],
    ].filter(([, list]) => list && list.length);
    if (!groups.length) return null;

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>Where to watch</Typography>
            <Stack spacing={1.5}>
                {groups.map(([label, list]) => (
                    <Stack key={label} direction="row" alignItems="center" spacing={1.5}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 48 }}>{label}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {list.slice(0, 8).map(p => (
                                <Tooltip key={p.provider_id} title={p.provider_name}>
                                    <Link href={local.link} target="_blank" rel="noopener noreferrer">
                                        <Avatar variant="rounded" src={imageUrl(p.logo_path, 'w92')} alt={p.provider_name} sx={{ width: 40, height: 40 }} />
                                    </Link>
                                </Tooltip>
                            ))}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Availability data by JustWatch.
            </Typography>
        </Box>
    );
}

function Fact({ label, children }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
            <Typography>{children || '—'}</Typography>
        </Box>
    );
}

function DetailsSkeleton() {
    return (
        <Box sx={{ pt: 12 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}><Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto' }} /></Grid>
                <Grid item xs={12} md={9}>
                    <Skeleton variant="text" sx={{ fontSize: '3rem', width: '60%' }} />
                    <Skeleton width="40%" />
                    <Skeleton variant="rounded" height={120} sx={{ mt: 3 }} />
                </Grid>
            </Grid>
        </Box>
    );
}

function MovieDetails() {
    const { id } = useParams();
    const store = useStore();
    const { data: movie, loading, error, retry } = useAsync(() => agents.Movies.details(id), [id]);
    const [trailerOpen, setTrailerOpen] = useState(false);
    useDocumentTitle(movie ? `${movie.title} (${year(movie.release_date)})` : '');

    useEffect(() => {
        if (movie) store.addRecent(movie);
    }, [movie, store]);

    const crew = useMemo(() => {
        if (!movie) return [];
        const jobs = ['Director', 'Screenplay', 'Writer', 'Story', 'Novel'];
        const people = new Map();
        movie.credits.crew
            .filter(c => jobs.includes(c.job))
            .forEach(c => {
                const entry = people.get(c.id) || { id: c.id, name: c.name, jobs: [] };
                entry.jobs.push(c.job);
                people.set(c.id, entry);
            });
        return [...people.values()].slice(0, 6);
    }, [movie]);

    if (loading) return <DetailsSkeleton />;
    if (error) return <Box sx={{ pt: 10 }}><ErrorState error={error} onRetry={retry} /></Box>;

    const trailer = pickTrailer(movie.videos?.results);
    const rating = certification(movie);
    const recommendations = movie.recommendations?.results?.length
        ? movie.recommendations.results
        : movie.similar?.results;

    const share = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: movie.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                store.notify('Link copied to clipboard');
            }
        } catch (_e) {
            // The user cancelled the share sheet.
        }
    };

    return (
        <>
            <Box sx={{ position: 'relative', mx: { xs: -2, sm: -3 }, pt: { xs: 10, md: 14 }, pb: { xs: 4, md: 8 }, overflow: 'hidden' }}>
                {movie.backdrop_path && (
                    <Box
                        component="img"
                        src={imageUrl(movie.backdrop_path, 'w1280')}
                        alt=""
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                )}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(11,13,18,.97) 0%, rgba(11,13,18,.85) 50%, rgba(11,13,18,.6) 100%), linear-gradient(0deg, #0b0d12 0%, transparent 30%)',
                }} />
                <Grid container spacing={{ xs: 3, md: 5 }} sx={{ position: 'relative', px: { xs: 2, sm: 3, md: 6 } }}>
                    <Grid item xs={7} sm={4} md={3} sx={{ mx: { xs: 'auto', sm: 0 } }}>
                        <Box sx={{ position: 'relative', aspectRatio: '2 / 3', borderRadius: 3, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.6)' }}>
                            {movie.poster_path ? (
                                <Box component="img" src={imageUrl(movie.poster_path, 'w500')} alt={`${movie.title} poster`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <PosterPlaceholder />}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                        <Typography variant="h3" component="h1">
                            {movie.title}{' '}
                            {movie.release_date && (
                                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>({year(movie.release_date)})</Box>
                            )}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 1.5, color: 'text.secondary' }}>
                            {rating && <Chip label={rating} size="small" variant="outlined" />}
                            {movie.release_date && <Typography variant="body2">{longDate(movie.release_date)}</Typography>}
                            {movie.runtime > 0 && <Typography variant="body2">• {runtime(movie.runtime)}</Typography>}
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                            {movie.genres.map(g => (
                                <Chip key={g.id} label={g.name} size="small" component={RouterLink} to={`/discover?genres=${g.id}`} clickable />
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                            <RatingBadge vote={movie.vote_average} size={60} />
                            <Box sx={{ mr: 1 }}>
                                <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>User<br />score</Typography>
                            </Box>
                            <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => setTrailerOpen(true)} disabled={!trailer}>
                                {trailer ? 'Play trailer' : 'No trailer'}
                            </Button>
                            <FavoriteButton movie={movie} sx={roundButton} />
                            <WatchlistButton movie={movie} sx={roundButton} />
                            <Tooltip title="Share">
                                <IconButton aria-label="Share" onClick={share} sx={roundButton}><ShareIcon /></IconButton>
                            </Tooltip>
                        </Stack>

                        {movie.tagline && (
                            <Typography sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}>“{movie.tagline}”</Typography>
                        )}
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Overview</Typography>
                        <Typography sx={{ maxWidth: 820, lineHeight: 1.7 }}>{movie.overview || 'No overview available.'}</Typography>

                        {crew.length > 0 && (
                            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 820 }}>
                                {crew.map(person => (
                                    <Grid item xs={6} sm={4} key={person.id}>
                                        <Link component={RouterLink} to={`/person/${person.id}`} color="inherit" underline="hover" sx={{ fontWeight: 700 }}>
                                            {person.name}
                                        </Link>
                                        <Typography variant="body2" color="text.secondary">{person.jobs.join(', ')}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={9}>
                    {movie.credits.cast.length > 0 && (
                        <MovieRow title="Top cast">
                            {movie.credits.cast.slice(0, 20).map(person => <CastCard key={person.credit_id} person={person} />)}
                        </MovieRow>
                    )}
                    <MovieRow title="You might also like" items={recommendations} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Stack spacing={2.5} sx={{ my: { md: 5 }, p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        <Providers providers={movie['watch/providers']} />
                        <Divider />
                        <Fact label="Status">{movie.status}</Fact>
                        <Fact label="Original language">{languageName(movie.original_language)}</Fact>
                        {movie.original_title !== movie.title && <Fact label="Original title">{movie.original_title}</Fact>}
                        <Fact label="Budget">{money(movie.budget)}</Fact>
                        <Fact label="Revenue">{money(movie.revenue)}</Fact>
                        {movie.production_companies?.length > 0 && (
                            <Fact label="Production">{movie.production_companies.slice(0, 3).map(c => c.name).join(', ')}</Fact>
                        )}
                        {movie.homepage && (
                            <Button variant="outlined" href={movie.homepage} target="_blank" rel="noopener noreferrer">
                                Official website
                            </Button>
                        )}
                    </Stack>
                </Grid>
            </Grid>

            <TrailerDialog open={trailerOpen} video={trailer} onClose={() => setTrailerOpen(false)} />
        </>
    );
}

export default observer(MovieDetails);
