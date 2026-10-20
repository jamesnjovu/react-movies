import { Button } from "@mui/material";
import TheatersIcon from "@mui/icons-material/Theaters";
import { Link as RouterLink } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useAsync";
import { EmptyState } from "../components/StateViews";

export default function NotFound() {
    useDocumentTitle('Page not found');
    return (
        <EmptyState
            icon={TheatersIcon}
            title="This scene was cut"
            message="The page you're looking for doesn't exist."
            action={<Button variant="contained" component={RouterLink} to="/">Back to home</Button>}
        />
    );
}
