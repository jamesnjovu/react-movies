import { Box, Button, Chip, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Link as RouterLink } from "react-router-dom";
import agents, { CATEGORIES } from "../../api/movie_agent";
import { freeClassics } from "../../api/archive";
import { region } from "../../utils/format";
import { useAsync, useDocumentTitle } from "../../hooks/useAsync";
import { useStore } from "../../store/store";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { ErrorState } from "../components/StateViews";

function CategoryRow({ category }) {
    const { data, loading, error } = useAsync(() => agents.Movies.category(category), [category]);
    if (error) return null;
    return (
        <MovieRow
            title={CATEGORIES[category].title}
            items={data?.results}
            loading={loading}
            seeAllTo={`/movies/${category}`}
        />
    );
}

function FreeClassicsRow() {
    const { data, loading, error } = useAsync(() => freeClassics(), []);
    if (error || (!loading && !data?.length)) return null;
    return <MovieRow title="Free Classics · Watch the full movie" items={data} loading={loading} />;
}

function FreeToStreamRow() {
    const { data, loading, error } = useAsync(() => agents.Movies.discover({
        sort_by: 'popularity.desc',
        watch_region: region(),
        with_watch_monetization_types: 'free|ads',
    }), []);
    if (error) return null;
    return <MovieRow title="Free to Stream" items={data?.results} loading={loading} seeAllTo="/discover?watch=free" />;
}

function GenreChips() {
    const { data } = useAsync(() => agents.Movies.genres(), []);
    if (!data) return null;
    return (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {data.map(genre => (
                <Chip
                    key={genre.id}
                    label={genre.name}
                    component={RouterLink}
                    to={`/discover?genres=${genre.id}`}
                    clickable
                    variant="outlined"
                />
            ))}
        </Stack>
    );
}

function Home() {
    const store = useStore();
    const trending = useAsync(() => agents.Movies.category('trending'), []);
    useDocumentTitle();

    if (trending.error) {
        return <Box sx={{ pt: 10 }}><ErrorState error={trending.error} onRetry={trending.retry} /></Box>;
    }

    return (
        <>
            <HeroBanner movies={trending.data?.results} loading={trending.loading} />
            <Box sx={{ position: 'relative', mt: { xs: -2, md: -4 } }}>
                <GenreChips />
                {store.recent.length > 0 && (
                    <MovieRow
                        title="Continue exploring"
                        items={store.recent}
                        action={<Button size="small" color="inherit" onClick={() => store.clearList('recent')}>Clear</Button>}
                    />
                )}
                <MovieRow
                    title={CATEGORIES.trending.title}
                    items={trending.data?.results}
                    loading={trending.loading}
                    seeAllTo="/movies/trending"
                />
                {store.watchlist.length > 0 && (
                    <MovieRow title="Your Watchlist" items={store.watchlist} seeAllTo="/library?tab=watchlist" />
                )}
                <FreeToStreamRow />
                <CategoryRow category="popular" />
                <CategoryRow category="now_playing" />
                <CategoryRow category="top_rated" />
                <CategoryRow category="upcoming" />
                <FreeClassicsRow />
            </Box>
        </>
    );
}

export default observer(Home);
