import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/authentication/Login";
import Home from "./pages/Home";
import Register from "./pages/authentication/Register";
import Profile from "./pages/Profile";
import Beer from "./pages/Beer";
import AppBar from "./components/customs/AppBar";
import Authentication from "./services/Authentication";
import theme from "./theme";
import { ToastProvider } from "./context/ToastContext";
import { DialogProvider } from "./context/DialogContext";
import { AuthProvider } from "./context/AuthContext";

import "./styles.scss";
const PrivateRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated === null) {
    return <h1>Carregando...</h1>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const checkAuth = async () => {
    const auth = await Authentication.isAuthenticated();
    setIsAuthenticated(auth);
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <DialogProvider>
            <ToastProvider>
              {isAuthenticated && <AppBar />}

              <Container maxWidth="lg">
                <Box className="appBody" sx={{ py: 4 }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                      path="/"
                      element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                          <Home />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/beer/:id"
                      element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                          <Beer />
                        </PrivateRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Container>
            </ToastProvider>
          </DialogProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
