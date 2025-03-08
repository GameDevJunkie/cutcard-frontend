import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3A86FF", // Vibrant yet soft blue for a modern, creative feel
            light: "#A3BFFA",
            dark: "#2A5DB0",
        },
        secondary: {
            main: "#FF6B6B", // Warm coral for an artsy, energetic accent
            light: "#FFA8A8",
            dark: "#C44D4D",
        },
        background: {
            default: "#F7F8FC", // Subtle textured off-white
            paper: "linear-gradient(145deg, #FFFFFF 0%, #F5F7FA 100%)", // Gradient for cards
        },
        text: {
            primary: "#2D3748", // Deep slate for readability
            secondary: "#718096",
            hint: "#A0AEC0",
        },
        error: {
            main: "#EF4444",
        },
        success: {
            main: "#10B981",
        },
    },
    typography: {
        fontFamily: "'Lora', 'Poppins', 'Roboto', sans-serif", // Lora adds an artistic serif touch
        h1: { fontWeight: 700, fontSize: "2.8rem", letterSpacing: "-1.2px", fontFamily: "'Lora'" },
        h4: { fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.8px", fontFamily: "'Lora'" },
        h5: { fontWeight: 600, fontSize: "1.6rem", fontFamily: "'Lora'" },
        h6: { fontWeight: 500, fontSize: "1.3rem", fontFamily: "'Poppins'" },
        body1: { fontWeight: 400, fontSize: "1rem", fontFamily: "'Poppins'" },
        body2: { fontWeight: 300, fontSize: "0.9rem", fontFamily: "'Poppins'" },
        button: { fontWeight: 600, fontSize: "1rem", textTransform: "none", fontFamily: "'Poppins'" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    padding: "10px 28px",
                    boxShadow: "0 6px 18px rgba(58, 134, 255, 0.2)", // Soft blue glow
                    background: "linear-gradient(135deg, #3A86FF 0%, #60A5FA 100%)",
                    color: "#FFFFFF",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        boxShadow: "0 8px 24px rgba(58, 134, 255, 0.3)",
                        background: "#2A5DB0",
                    },
                    "&:disabled": {
                        background: "#E2E8F0",
                        color: "#A0AEC0",
                    },
                },
                containedSecondary: {
                    background: "linear-gradient(135deg, #FF6B6B 0%, #FFA8A8 100%)",
                    "&:hover": {
                        background: "#C44D4D",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: "linear-gradient(145deg, #FFFFFF 0%, #F5F7FA 100%)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03)",
                    borderRadius: 20,
                    border: "1px solid rgba(58, 134, 255, 0.1)", // Subtle decorative border
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,
                        background: "rgba(255, 255, 255, 0.9)",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#A3BFFA",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3A86FF",
                            boxShadow: "0 0 8px rgba(58, 134, 255, 0.3)",
                        },
                    },
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #F9FAFB 0%, #EDF2F7 100%)",
                    padding: "12px",
                },
            },
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export default theme;