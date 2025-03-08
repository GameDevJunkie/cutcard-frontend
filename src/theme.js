import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Deep blue
            light: "#42a5f5",
            dark: "#1565c0",
        },
        secondary: {
            main: "#ff4081", // Vibrant pink
            light: "#ff80ab",
            dark: "#c51162",
        },
        background: {
            default: "#f5f5f5", // Light gray
            paper: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)", // Subtle gradient for cards
        },
        text: {
            primary: "#212121",
            secondary: "#757575",
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        h4: { fontWeight: 700, letterSpacing: "-0.5px" },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 500 },
        body1: { fontWeight: 400 },
        body2: { fontWeight: 300 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                },
            },
        },
    },
});

export default theme;