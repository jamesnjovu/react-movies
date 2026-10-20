import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddOutlined";
import HistoryIcon from "@mui/icons-material/History";
import { observer } from "mobx-react-lite";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useAsync";
import { useStore } from "../../store/store";
import MovieGrid from "../components/MovieGrid";
import { EmptyState } from "../components/StateViews";

const TABS = {
    favorites: {
        label: 'Favorites',
        icon: FavoriteBorderIcon,
        empty: 'Tap the heart on any movie to keep it here.',
    },
    watchlist: {
        label: 'Watchlist',
        icon: BookmarkAddIcon,
        empty: 'Save movies you want to watch later with the bookmark button.',
    },
    recent: {
        label: 'Recently viewed',
        icon: HistoryIcon,
        empty: 'Movies you open will show up here.',
    },
};

function Library() {
    const store = useStore();
    const [params, setParams] = useSearchParams();
    const tab = TABS[params.get('tab')] ? params.get('tab') : 'favorites';
    const items = store[tab];
    useDocumentTitle('My Library');

    return (
        <>
            <Stack direction="row" alignItems="flex-end" sx={{ mt: 3, mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="h1" sx={{ mb: 1 }}>My Library</Typography>
                    <Typography color="text.secondary">Saved on this device.</Typography>
                </Box>
                {items.length > 0 && (
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => {
                            if (window.confirm(`Clear all ${TABS[tab].label.toLowerCase()}?`)) store.clearList(tab);
                        }}
                    >
                        Clear
                    </Button>
                )}
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_e, value) => setParams({ tab: value }, { replace: true })}
                    variant="scrollable"
                    allowScrollButtonsMobile
                >
                    {Object.entries(TABS).map(([key, t]) => (
                        <Tab
                            key={key}
                            value={key}
                            icon={<t.icon fontSize="small" />}
                            iconPosition="start"
                            label={`${t.label} (${store[key].length})`}
                        />
                    ))}
                </Tabs>
            </Box>
            {items.length === 0 ? (
                <EmptyState
                    icon={TABS[tab].icon}
                    title={`No ${TABS[tab].label.toLowerCase()} yet`}
                    message={TABS[tab].empty}
                    action={<Button variant="contained" component={RouterLink} to="/discover">Discover movies</Button>}
                />
            ) : <MovieGrid items={items} />}
        </>
    );
}

export default observer(Library);
