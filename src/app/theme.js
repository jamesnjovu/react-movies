import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#f5c518', contrastText: '#111' },
        secondary: { main: '#e5484d' },
        background: { default: '#0b0d12', paper: '#151821' },
        text: { primary: '#f2f3f5', secondary: '#a3a8b8' },
        divider: 'rgba(255,255,255,0.08)',
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 800 },
        h4: { fontWeight: 800 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { scrollbarColor: '#2a2f3d #0b0d12' },
                '*::-webkit-scrollbar': { width: 10, height: 10 },
                '*::-webkit-scrollbar-thumb': { background: '#2a2f3d', borderRadius: 8 },
                '*::-webkit-scrollbar-track': { background: 'transparent' },
            },
        },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } },
        },
        MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    },
}));

export default theme;
