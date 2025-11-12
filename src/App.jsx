import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, DialogContent } from '@mui/material';
import Login from "./pages/authentication/Login";
import Home from "./pages/Home";
import Register from "./pages/authentication/Register";
import Profile from "./pages/Profile";
import Beer from "./pages/Beer";
import Authentication from "./services/Authentication";
import React from "react";
import { ToastProvider } from "./context/ToastContext";
import "./styles.scss";
import AppBar from "./components/customs/AppBar";
import theme from './theme';
import { DialogProvider } from './context/DialogContext';



const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);
    const [currentRoute, setCurrentRoute] = React.useState(window.location.pathname);

    const checkAuth = async () => {
        const auth = await Authentication.isAuthenticated();
        setIsAuthenticated(auth);
    }

    React.useEffect(() => {
        checkAuth();
        setCurrentRoute(window.location.pathname)
    }, []);

    const getPrivateRoute = () => {
        switch (currentRoute) {
            case '/':
            return <Home />;
            case '/profile':
            return <Profile />;
            case '/login':
            return window.location.href = '/';
            case '/register':
            return window.location.href = '/login';
            default:
                if (currentRoute.startsWith('/beer')) {
                    return <Beer currentRoute={currentRoute} />;
                }
                return window.location.href = '/';
        }
    }
    const getPublicRoute = () => {
        switch (currentRoute) {
            case '/login':
                return <Login />;
            case '/register':
                return <Register />;
            default:
                return window.location.href = '/login';
        }
    }

    return <ThemeProvider theme={theme}>
                <CssBaseline />
                <DialogProvider>
                    <ToastProvider>
                        {isAuthenticated && <AppBar onNavigate={setCurrentRoute} />}
                        <Container maxWidth="lg">
                            <Box className="appBody" sx={{ py: 4 }}>
                                {
                                    isAuthenticated === null ? <h1>Carregando...</h1> : (
                                        isAuthenticated ? getPrivateRoute() : getPublicRoute()
                                    )
                                }
                            </Box>
                        </Container>
                    </ToastProvider>
                </DialogProvider>
            </ThemeProvider>;
}

export default App;