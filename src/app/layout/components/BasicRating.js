import { Box, Rating } from "@mui/material";
import { useEffect, useState } from "react";

export default function BasicRating(props) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const vote = props.vote_average;
        const percentage = vote / 10 * 100
        const result = percentage / 100 * 5
        setValue(result)
    }, [])

    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}
        >
        <Rating
            name="simple-controlled"
            value={value}
        />
        </Box>
    )
}
