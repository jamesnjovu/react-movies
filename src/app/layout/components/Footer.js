import { Box, Container, Link, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 8, py: 4 }}>
            <Container maxWidth="xl">
                <Typography variant="body2" color="text.secondary">
                    Movie data and images provided by{' '}
                    <Link href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</Link>.
                    {' '}This product uses the TMDB API but is not endorsed or certified by TMDB.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    © {new Date().getFullYear()} CineScope
                </Typography>
            </Container>
        </Box>
    );
}
