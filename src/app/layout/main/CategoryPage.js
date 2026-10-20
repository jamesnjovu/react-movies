import { Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import agents, { CATEGORIES } from "../../api/movie_agent";
import { useDocumentTitle, usePaginated } from "../../hooks/useAsync";
import MovieGrid from "../components/MovieGrid";
import { ErrorState } from "../components/StateViews";

function CategoryList({ category }) {
    const { items, loading, error, loadMore, retry, hasMore } = usePaginated(
        (page) => agents.Movies.category(category, page),
        [category],
    );
    useDocumentTitle(CATEGORIES[category].title);

    return (
        <>
            <Typography variant="h4" component="h1" sx={{ my: 3 }}>{CATEGORIES[category].title}</Typography>
            {error && items.length === 0
                ? <ErrorState error={error} onRetry={retry} />
                : <MovieGrid items={items} loading={loading} hasMore={hasMore && !error} onLoadMore={loadMore} />}
        </>
    );
}

export default function CategoryPage() {
    const { category } = useParams();
    if (!CATEGORIES[category]) return <Navigate to="/" replace />;
    return <CategoryList category={category} />;
}
