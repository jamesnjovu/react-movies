import { Box, CircularProgress, Typography } from "@mui/material";
import { ratingColor } from "../../utils/format";

export default function RatingBadge({ vote = 0, size = 40, sx }) {
    const percent = Math.round(vote * 10);
    return (
        <Box
            title={`Rated ${vote ? vote.toFixed(1) : 'N/A'} / 10`}
            sx={{
                position: 'relative',
                width: size,
                height: size,
                borderRadius: '50%',
                bgcolor: '#081c22',
                display: 'inline-flex',
                flexShrink: 0,
                ...sx,
            }}
        >
            <CircularProgress
                variant="determinate"
                value={100}
                size={size - 6}
                thickness={4}
                sx={{ position: 'absolute', top: 3, left: 3, color: 'rgba(255,255,255,0.12)' }}
            />
            <CircularProgress
                variant="determinate"
                value={percent}
                size={size - 6}
                thickness={4}
                sx={{ position: 'absolute', top: 3, left: 3, color: ratingColor(vote) }}
            />
            <Typography
                component="span"
                sx={{
                    m: 'auto',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: size * 0.3,
                    lineHeight: 1,
                }}
            >
                {vote ? percent : 'NR'}
                {vote ? <Box component="sup" sx={{ fontSize: '0.5em' }}>%</Box> : null}
            </Typography>
        </Box>
    );
}
