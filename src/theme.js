import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1E88E5", // Vibrant blue for professionalism
            light: "#90CAF9",
            dark: "#1565C0",
        },
        secondary: {
            main: "#D81B60", // Elegant pink accent
            light: "#F06292",
            dark: "#AD1457",
        },
        background: {
            default: "#F9FBFC", // Soft off-white for a clean background
            paper: "#FFFFFF", // Pure white for cards with subtle shadows
        },
        text: {
            primary: "#212121",
            secondary: "#757575",
            hint: "#B0BEC5",
        },
        error: {
            main: "#D32F2F",
        },
        success: {
            main: "#2E7D32",
        },
    },
    typography: {
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        h1: { fontWeight: 700, fontSize: "2.5rem", letterSpacing: "-1px" }, // For branding/logo
        h4: { fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.5px" },
        h5: { fontWeight: 600, fontSize: "1.5rem" },
        h6: { fontWeight: 500, fontSize: "1.25rem" },
        body1: { fontWeight: 400, fontSize: "1rem" },
        body2: { fontWeight: 300, fontSize: "0.875rem" },
        button: { fontWeight: 600, textTransform: "none" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "8px 24px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                        backgroundColor: (theme) => theme.palette.primary.dark,
                    },
                    "&:disabled": {
                        backgroundColor: "#E0E0E0",
                        color: "#9E9E9E",
                    },
                },
                containedSecondary: {
                    "&:hover": {
                        backgroundColor: (theme) => theme.palette.secondary.dark,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: "#FFFFFF",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    borderRadius: 16,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.palette.primary.light,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.palette.primary.main,
                        },
                    },
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 100%)",
                },
            },
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export default theme;