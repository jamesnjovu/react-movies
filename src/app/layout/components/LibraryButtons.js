import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

const stop = (fn) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
};

export const FavoriteButton = observer(({ movie, size = 'medium', sx }) => {
    const store = useStore();
    const active = store.isFavorite(movie.id);
    return (
        <Tooltip title={active ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
                size={size}
                aria-pressed={active}
                aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
                onClick={stop(() => store.toggleFavorite(movie))}
                sx={{ color: active ? 'secondary.main' : 'common.white', ...sx }}
            >
                {active ? <FavoriteIcon fontSize="inherit" /> : <FavoriteBorderIcon fontSize="inherit" />}
            </IconButton>
        </Tooltip>
    );
});

export const WatchlistButton = observer(({ movie, size = 'medium', sx }) => {
    const store = useStore();
    const active = store.isInWatchlist(movie.id);
    return (
        <Tooltip title={active ? 'Remove from watchlist' : 'Add to watchlist'}>
            <IconButton
                size={size}
                aria-pressed={active}
                aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
                onClick={stop(() => store.toggleWatchlist(movie))}
                sx={{ color: active ? 'primary.main' : 'common.white', ...sx }}
            >
                {active ? <BookmarkAddedIcon fontSize="inherit" /> : <BookmarkAddIcon fontSize="inherit" />}
            </IconButton>
        </Tooltip>
    );
});
