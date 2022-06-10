import { AppBar, Badge, Box, Button, Container, CssBaseline, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../store/store";

const logo = 'BPTN';

function Header() {
    const store = useStore();
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters
                        sx={{justifyContent: 'space-between'}}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>
                            {logo}
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label=""
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit">
                                =
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                                >
                                <MenuItem key='home' onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link href="/" underline="none">
                                            Home
                                        </Link>
                                    </Typography>
                                </MenuItem>
                                <MenuItem key='liked' onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link href="/liked" underline="none">
                                            <Badge badgeContent={store.liked_movies.length} color="success">
                                                Liked Movies
                                            </Badge>
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                boxShadow: 6,
                                borderColor: 'white',
                                borderTop: 5,
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {logo}
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button 
                            href="/"
                            key='home'
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                        Home
                        </Button>
                        <Button 
                            href="/liked"
                            key='liked'
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Badge badgeContent={store.liked_movies.length} showZero color="success">
                                Liked Movies
                            </Badge>
                        </Button>
                        
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
  }

export default observer(Header);