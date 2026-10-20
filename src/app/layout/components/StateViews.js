import { Box, Button, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import KeyIcon from "@mui/icons-material/VpnKeyOutlined";
import { isConfigured } from "../../api/movie_agent";

export function EmptyState({ icon: Icon, title, message, action }) {
    return (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
            {Icon && <Icon sx={{ fontSize: 64, opacity: 0.5 }} />}
            <Typography variant="h6" color="text.primary">{title}</Typography>
            {message && <Typography sx={{ maxWidth: 420 }}>{message}</Typography>}
            {action && <Box sx={{ pt: 1 }}>{action}</Box>}
        </Stack>
    );
}

export function ErrorState({ error, onRetry }) {
    if (!isConfigured) {
        return (
            <EmptyState
                icon={KeyIcon}
                title="TMDB is not configured"
                message="Set REACT_APP_TMDB_PROXY_URL (recommended) or REACT_APP_API_KEY in a .env file and restart the app. See the README for details."
            />
        );
    }
    const status = error?.response?.status;
    const message = status === 401
        ? 'The movie service rejected our credentials. Check the API key configured on the proxy.'
        : status === 404
            ? "We couldn't find what you were looking for."
            : 'Something went wrong while loading movies. Check your connection and try again.';
    return (
        <EmptyState
            icon={ErrorOutlineIcon}
            title="Oops!"
            message={message}
            action={onRetry && status !== 404 && <Button variant="contained" onClick={onRetry}>Try again</Button>}
        />
    );
}
