import { Alert, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

function Toaster() {
    const store = useStore();
    const handleClose = (_e, reason) => {
        if (reason !== 'clickaway') store.clearToast();
    };
    return (
        <Snackbar
            key={store.toast?.key}
            open={Boolean(store.toast)}
            autoHideDuration={2500}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                {store.toast?.message}
            </Alert>
        </Snackbar>
    );
}

export default observer(Toaster);
