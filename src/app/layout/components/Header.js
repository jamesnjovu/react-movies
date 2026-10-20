import {
    AppBar, Badge, Box, Button, Container, Divider, Drawer, IconButton, InputBase, List, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography, useScrollTrigger,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import ExploreIcon from "@mui/icons-material/ExploreOutlined";
import LibraryIcon from "@mui/icons-material/VideoLibraryOutlined";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { NavLink, Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../store/store";

export const APP_NAME = 'CineScope';

const NAV = [
    { to: '/', label: 'Home', icon: HomeIcon, end: true },
    { to: '/discover', label: 'Discover', icon: ExploreIcon },
    { to: '/library', label: 'My Library', icon: LibraryIcon, badge: true },
];

function SearchBox({ autoFocus, onDone }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const onSearchPage = location.pathname === '/search';
    const [value, setValue] = useState(onSearchPage ? params.get('q') || '' : '');
    const timer = useRef();

    // Keep the box in sync when the query changes from elsewhere (e.g. back button).
    useEffect(() => {
        if (onSearchPage) setValue(params.get('q') || '');
        else setValue('');
    }, [onSearchPage, params]);

    useEffect(() => () => clearTimeout(timer.current), []);

    const go = (q, replace) => {
        if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`, { replace });
    };

    const handleChange = (e) => {
        const q = e.target.value;
        setValue(q);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => go(q, onSearchPage), 400);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        go(value, onSearchPage);
        onDone && onDone();
    };

    return (
        <Box
            component="form"
            role="search"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
                bgcolor: (t) => alpha(t.palette.common.white, 0.08),
                border: '1px solid rgba(255,255,255,.08)',
                px: 1.5,
                width: '100%',
                transition: 'background-color .2s, border-color .2s',
                '&:focus-within': {
                    bgcolor: (t) => alpha(t.palette.common.white, 0.12),
                    borderColor: 'primary.main',
                },
            }}
        >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
                autoFocus={autoFocus}
                placeholder="Search movies…"
                value={value}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Search movies' }}
                sx={{ flexGrow: 1, py: 0.75 }}
            />
            {value && (
                <IconButton size="small" aria-label="Clear search" onClick={() => setValue('')}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
}

function Logo() {
    return (
        <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', mr: 3 }}
        >
            <MovieFilterIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-.02em' }}>
                Cine<Box component="span" sx={{ color: 'primary.main' }}>Scope</Box>
            </Typography>
        </Box>
    );
}

function Header() {
    const store = useStore();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
    const libraryCount = store.favorites.length + store.watchlist.length;
    const transparent = !scrolled && (location.pathname === '/' || location.pathname.startsWith('/movie/'));

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: transparent ? 'transparent' : 'rgba(11,13,18,.85)',
                backgroundImage: transparent ? 'linear-gradient(180deg, rgba(0,0,0,.7), transparent)' : 'none',
                backdropFilter: transparent ? 'none' : 'saturate(180%) blur(16px)',
                borderBottom: '1px solid',
                borderColor: transparent ? 'transparent' : 'divider',
                transition: 'background-color .3s, border-color .3s',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ gap: 1 }}>
                    {mobileSearch ? (
                        <>
                            <SearchBox autoFocus onDone={() => setMobileSearch(false)} />
                            <IconButton aria-label="Close search" onClick={() => setMobileSearch(false)}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                aria-label="Open menu"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ display: { md: 'none' }, mr: 0.5 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Logo />
                            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
                                {NAV.map(item => (
                                    <Button
                                        key={item.to}
                                        component={NavLink}
                                        to={item.to}
                                        end={item.end}
                                        color="inherit"
                                        sx={{
                                            color: 'text.secondary',
                                            '&.active': { color: 'text.primary', bgcolor: 'rgba(255,255,255,.08)' },
                                        }}
                                    >
                                        {item.badge ? (
                                            <Badge badgeContent={libraryCount} color="primary" max={99} sx={{ '& .MuiBadge-badge': { right: -10 } }}>
                                                {item.label}
                                            </Badge>
                                        ) : item.label}
                                    </Button>
                                ))}
                            </Box>
                            <Box sx={{ flexGrow: 1, display: { md: 'none' } }} />
                            <Box sx={{ display: { xs: 'none', md: 'block' }, width: 340 }}>
                                <SearchBox />
                            </Box>
                            <IconButton aria-label="Search" onClick={() => setMobileSearch(true)} sx={{ display: { md: 'none' } }}>
                                <SearchIcon />
                            </IconButton>
                        </>
                    )}
                </Toolbar>
            </Container>
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 280, bgcolor: 'background.default' } }}
            >
                <Box sx={{ p: 2 }}><Logo /></Box>
                <Divider />
                <List onClick={() => setDrawerOpen(false)}>
                    {NAV.map(item => (
                        <ListItemButton
                            key={item.to}
                            component={NavLink}
                            to={item.to}
                            end={item.end}
                            sx={{ '&.active': { bgcolor: 'rgba(245,197,24,.12)', color: 'primary.main' } }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                <Badge badgeContent={item.badge ? libraryCount : 0} color="primary">
                                    <item.icon />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
}

export default observer(Header);
