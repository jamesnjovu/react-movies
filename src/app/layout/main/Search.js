import { Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import agents from "../../api/movie_agent";
import { useDocumentTitle, usePaginated } from "../../hooks/useAsync";
import MovieGrid from "../components/MovieGrid";
import { EmptyState, ErrorState } from "../components/StateViews";

function Results({ query }) {
    const { items, loading, error, loadMore, retry, hasMore, totalResults } = usePaginated(
        (page) => agents.Movies.search(query, page),
        [query],
    );

    if (error && items.length === 0) return <ErrorState error={error} onRetry={retry} />;
    if (!loading && items.length === 0) {
        return (
            <EmptyState
                icon={SearchOffIcon}
                title={`No results for "${query}"`}
                message="Check the spelling or try a different title."
            />
        );
    }
    return (
        <>
            {!loading || items.length > 0 ? (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {totalResults.toLocaleString()} result{totalResults === 1 ? '' : 's'}
                </Typography>
            ) : null}
            <MovieGrid items={items} loading={loading} hasMore={hasMore && !error} onLoadMore={loadMore} />
        </>
    );
}

export default function Search() {
    const [params] = useSearchParams();
    const query = (params.get('q') || '').trim();
    useDocumentTitle(query ? `Search: ${query}` : 'Search');

    return (
        <>
            <Typography variant="h4" component="h1" sx={{ my: 3 }}>
                {query ? <>Results for “{query}”</> : 'Search'}
            </Typography>
            {query
                ? <Results query={query} />
                : <EmptyState icon={SearchIcon} title="Find your next movie" message="Start typing in the search bar above." />}
        </>
    );
}
