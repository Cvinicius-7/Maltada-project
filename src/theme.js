import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f6b033" },
    secondary: { main: "#f5a415" },
    background: {
      default: "#201f0bff",
      paper: "#2a2a11ff",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: [
      "Inter",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: ({ palette }) => ({
        "html, body, #root": { height: "100%" },
        body: {
          backgroundImage:
            "radial-gradient(60% 80% at 10% 0%, rgba(197, 173, 34, 0.15) 0, rgba(189, 197, 34, 0) 60%),\n             radial-gradient(60% 80% at 90% 20%, rgba(244, 246, 92, 0.18) 0, rgba(246, 223, 92, 0) 60%)",
          backgroundAttachment: "fixed",
        },
      }),
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "saturate(120%) blur(6px)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.02)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(42, 37, 17, 0.8)",
          backdropFilter: "blur(8px)",
        },
      },
    },
  },
});

export default theme;
