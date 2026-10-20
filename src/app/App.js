import { Box, CircularProgress, Container, Toolbar } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from './layout/components/Header';
import Footer from './layout/components/Footer';
import ScrollToTop from './layout/components/ScrollToTop';
import Toaster from './layout/components/Toaster';
import Home from './layout/main/Home';

const Discover = lazy(() => import('./layout/main/Discover'));
const Search = lazy(() => import('./layout/main/Search'));
const CategoryPage = lazy(() => import('./layout/main/CategoryPage'));
const MovieDetails = lazy(() => import('./layout/main/MovieDetails'));
const PersonDetails = lazy(() => import('./layout/main/PersonDetails'));
const Library = lazy(() => import('./layout/main/Library'));
const NotFound = lazy(() => import('./layout/main/NotFound'));

// Pages with a full-bleed hero that sits underneath the transparent header.
const isHeroPage = (pathname) => pathname === '/' || pathname.startsWith('/movie/');

function App() {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Header />
      {!isHeroPage(pathname) && <Toolbar />}
      <Container maxWidth="xl" component="main" sx={{ flexGrow: 1, overflowX: 'clip' }}>
        <Suspense fallback={<Box sx={{ display: 'grid', placeItems: 'center', py: 20 }}><CircularProgress /></Box>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="discover" element={<Discover />} />
            <Route path="search" element={<Search />} />
            <Route path="movies/:category" element={<CategoryPage />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="person/:id" element={<PersonDetails />} />
            <Route path="library" element={<Library />} />
            <Route path="liked" element={<Navigate to="/library" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Container>
      <Footer />
      <Toaster />
    </Box>
  );
}

export default App;
