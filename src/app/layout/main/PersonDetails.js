import { Avatar, Box, Button, Grid, Skeleton, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import agents, { imageUrl } from "../../api/movie_agent";
import { useAsync, useDocumentTitle } from "../../hooks/useAsync";
import { longDate } from "../../utils/format";
import MovieGrid from "../components/MovieGrid";
import { ErrorState } from "../components/StateViews";

const age = (birthday, deathday) => {
    if (!birthday) return null;
    const end = deathday ? new Date(deathday) : new Date();
    const start = new Date(birthday);
    let years = end.getFullYear() - start.getFullYear();
    if (end < new Date(end.getFullYear(), start.getMonth(), start.getDate())) years -= 1;
    return years;
};

export default function PersonDetails() {
    const { id } = useParams();
    const { data: person, loading, error, retry } = useAsync(() => agents.People.details(id), [id]);
    const [expanded, setExpanded] = useState(false);
    useDocumentTitle(person?.name);

    const credits = useMemo(() => {
        if (!person) return [];
        const all = [...person.movie_credits.cast, ...person.movie_credits.crew];
        const seen = new Set();
        return all
            .filter(m => !seen.has(m.id) && seen.add(m.id))
            .sort((a, b) => b.popularity - a.popularity);
    }, [person]);

    if (loading) {
        return (
            <Grid container spacing={4} sx={{ pt: { xs: 3, md: 5 } }}>
                <Grid item xs={12} sm={4} md={3}><Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto' }} /></Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Skeleton variant="text" sx={{ fontSize: '3rem', width: '50%' }} />
                    <Skeleton variant="rounded" height={160} />
                </Grid>
            </Grid>
        );
    }
    if (error) return <ErrorState error={error} onRetry={retry} />;

    const personAge = age(person.birthday, person.deathday);
    const bio = person.biography || `We don't have a biography for ${person.name}.`;
    const longBio = bio.length > 600;

    return (
        <Box>
            <Grid container spacing={{ xs: 3, md: 5 }} sx={{ pt: { xs: 3, md: 5 } }}>
                <Grid item xs={7} sm={4} md={3} sx={{ mx: { xs: 'auto', sm: 0 } }}>
                    <Avatar
                        variant="rounded"
                        src={imageUrl(person.profile_path, 'h632') || undefined}
                        alt={person.name}
                        sx={{ width: '100%', height: 'auto', aspectRatio: '2 / 3', borderRadius: 3, bgcolor: 'background.paper' }}
                    >
                        <PersonIcon sx={{ fontSize: 80 }} />
                    </Avatar>
                    <Stack spacing={1.5} sx={{ mt: 3 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">KNOWN FOR</Typography>
                            <Typography>{person.known_for_department || '—'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">BORN</Typography>
                            <Typography>
                                {longDate(person.birthday)}
                                {personAge !== null && !person.deathday ? ` (${personAge} years old)` : ''}
                            </Typography>
                        </Box>
                        {person.deathday && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">DIED</Typography>
                                <Typography>{longDate(person.deathday)} ({personAge} years old)</Typography>
                            </Box>
                        )}
                        {person.place_of_birth && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">PLACE OF BIRTH</Typography>
                                <Typography>{person.place_of_birth}</Typography>
                            </Box>
                        )}
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h3" component="h1" sx={{ mb: 2 }}>{person.name}</Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>Biography</Typography>
                    <Typography
                        sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.7,
                            ...(!expanded && longBio && {
                                display: '-webkit-box',
                                WebkitLineClamp: 8,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }),
                        }}
                    >
                        {bio}
                    </Typography>
                    {longBio && (
                        <Button onClick={() => setExpanded(e => !e)} sx={{ mt: 1, px: 0 }}>
                            {expanded ? 'Show less' : 'Read more'}
                        </Button>
                    )}
                    <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                        Filmography ({credits.length})
                    </Typography>
                    <MovieGrid items={credits.slice(0, 60)} />
                </Grid>
            </Grid>
        </Box>
    );
}
