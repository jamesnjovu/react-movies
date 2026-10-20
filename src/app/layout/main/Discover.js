import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import agents from "../../api/movie_agent";
import { useAsync, useDocumentTitle, usePaginated } from "../../hooks/useAsync";
import MovieGrid from "../components/MovieGrid";
import { EmptyState, ErrorState } from "../components/StateViews";

const SORTS = [
    { value: 'popularity.desc', label: 'Most popular' },
    { value: 'vote_average.desc', label: 'Highest rated' },
    { value: 'primary_release_date.desc', label: 'Newest releases' },
    { value: 'revenue.desc', label: 'Box office' },
    { value: 'original_title.asc', label: 'Title (A–Z)' },
];

const RATINGS = [0, 5, 6, 7, 8];
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR + 2 - 1950 }, (_, i) => THIS_YEAR + 1 - i);

export default function Discover() {
    const [params, setParams] = useSearchParams();
    const genres = useMemo(() => (params.get('genres') || '').split(',').filter(Boolean), [params]);
    const sort = params.get('sort') || SORTS[0].value;
    const yearFilter = params.get('year') || '';
    const minRating = Number(params.get('rating') || 0);
    const genreList = useAsync(() => agents.Movies.genres(), []);
    useDocumentTitle('Discover');

    const update = (changes) => {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === 0 || value === SORTS[0].value) next.delete(key);
            else next.set(key, value);
        });
        setParams(next, { replace: true });
    };

    const toggleGenre = (id) => {
        const key = String(id);
        const next = genres.includes(key) ? genres.filter(g => g !== key) : [...genres, key];
        update({ genres: next.join(',') });
    };

    const filterKey = `${genres.join(',')}|${sort}|${yearFilter}|${minRating}`;
    const { items, loading, error, loadMore, retry, hasMore, totalResults } = usePaginated(
        (page) => agents.Movies.discover({
            page,
            sort_by: sort,
            with_genres: genres.join(',') || undefined,
            primary_release_year: yearFilter || undefined,
            'vote_average.gte': minRating || undefined,
            // Avoid obscure titles with a handful of votes dominating "highest rated".
            'vote_count.gte': sort === 'vote_average.desc' ? 300 : minRating ? 50 : undefined,
            // Don't show unreleased films when sorting by newest.
            'primary_release_date.lte': sort === 'primary_release_date.desc'
                ? new Date().toISOString().slice(0, 10)
                : undefined,
        }),
        [filterKey],
    );

    const hasFilters = genres.length > 0 || yearFilter || minRating || sort !== SORTS[0].value;

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ my: 3 }}>
                <TuneIcon color="primary" />
                <Typography variant="h4" component="h1">Discover</Typography>
            </Stack>

            <Box sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="sort-label">Sort by</InputLabel>
                        <Select labelId="sort-label" label="Sort by" value={sort} onChange={e => update({ sort: e.target.value })}>
                            {SORTS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id="year-label" shrink>Year</InputLabel>
                        <Select
                            labelId="year-label"
                            label="Year"
                            notched
                            displayEmpty
                            value={yearFilter}
                            onChange={e => update({ year: e.target.value })}
                            MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                        >
                            <MenuItem value="">Any year</MenuItem>
                            {YEARS.map(y => <MenuItem key={y} value={String(y)}>{y}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="rating-label">Minimum rating</InputLabel>
                        <Select labelId="rating-label" label="Minimum rating" value={minRating} onChange={e => update({ rating: e.target.value })}>
                            {RATINGS.map(r => <MenuItem key={r} value={r}>{r ? `${r}+ ★` : 'Any rating'}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Box sx={{ flexGrow: 1 }} />
                    {hasFilters && (
                        <Button color="inherit" onClick={() => setParams({}, { replace: true })}>Reset filters</Button>
                    )}
                </Stack>
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                    {(genreList.data || []).map(g => {
                        const selected = genres.includes(String(g.id));
                        return (
                            <Chip
                                key={g.id}
                                label={g.name}
                                clickable
                                color={selected ? 'primary' : 'default'}
                                variant={selected ? 'filled' : 'outlined'}
                                onClick={() => toggleGenre(g.id)}
                            />
                        );
                    })}
                </Stack>
            </Box>

            {!loading && !error && (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {totalResults.toLocaleString()} movie{totalResults === 1 ? '' : 's'} found
                </Typography>
            )}

            {error && items.length === 0 ? <ErrorState error={error} onRetry={retry} />
                : !loading && items.length === 0 ? (
                    <EmptyState
                        icon={MovieFilterIcon}
                        title="No movies match these filters"
                        action={<Button variant="contained" onClick={() => setParams({}, { replace: true })}>Reset filters</Button>}
                    />
                ) : <MovieGrid items={items} loading={loading} hasMore={hasMore && !error} onLoadMore={loadMore} />}
        </>
    );
}
