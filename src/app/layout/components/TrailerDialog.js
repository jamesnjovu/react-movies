import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function TrailerDialog({ video, open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { bgcolor: '#000', borderRadius: 3, overflow: 'hidden' } }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>{video?.name || 'Trailer'}</Typography>
                <IconButton aria-label="Close trailer" onClick={onClose}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ position: 'relative', aspectRatio: '16 / 9' }}>
                {video ? (
                    <Box
                        component="iframe"
                        title={video.name}
                        src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                    />
                ) : (
                    <Typography sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }} color="text.secondary">
                        No trailer available for this movie.
                    </Typography>
                )}
            </Box>
        </Dialog>
    );
}
