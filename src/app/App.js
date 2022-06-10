import Header from './layout/components/Header';
import { Routes, Route } from "react-router-dom";
import LikedMovies from './layout/main/LikedMovies';
import Home from './layout/main/Home';
import { Container } from '@mui/system';

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="liked" element={<LikedMovies />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
