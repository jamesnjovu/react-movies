import { Box, Dialog, IconButton, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { detailsUrl, embedUrl } from "../../api/archive";

// Plays a public-domain film using the Internet Archive's embeddable player.
export default function FullMovieDialog({ archiveId, title, open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { bgcolor: '#000', borderRadius: 3, overflow: 'hidden' } }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>{title}</Typography>
                <IconButton aria-label="Close player" onClick={onClose}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ position: 'relative', aspectRatio: '16 / 9' }}>
                {open && archiveId && (
                    <Box
                        component="iframe"
                        title={title}
                        src={embedUrl(archiveId)}
                        allow="autoplay; fullscreen"
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                    />
                )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
                Public-domain film streamed from the{' '}
                <Link href={detailsUrl(archiveId)} target="_blank" rel="noopener noreferrer">Internet Archive</Link>.
            </Typography>
        </Dialog>
    );
}
