import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Box, LinearProgress } from "@mui/material";
import { ToastProvider } from "./context/ToastContext";
import { DialogProvider } from "./context/DialogContext";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.scss";
import AppBar from "./components/customs/AppBar";
import theme from "./theme";
import { useAuth } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/Home"));
const EditProfilePage = lazy(() => import("./pages/EditProfile"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const BeerPage = lazy(() => import("./pages/Beer"));
const RegisterPage = lazy(() => import("./pages/authentication/Register"));
const LoginPage = lazy(() => import("./pages/authentication/Login"));
const StylesPage = lazy(() => import("./pages/Styles"));

const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children, isAuthenticated }) => {
  return !isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogProvider>
        <ToastProvider>
          <FilterProvider>
            <BrowserRouter>
              {isAuthenticated && <AppBar />}
              <Container maxWidth="lg">
                <Box className="appBody" sx={{ py: 4 }}>
                  <Suspense fallback={<LinearProgress />}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PrivateRoute isAuthenticated={isAuthenticated}>
                            <HomePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/beer/:id"
                        element={
                          <PrivateRoute isAuthenticated={isAuthenticated}>
                            <BeerPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute isAuthenticated={isAuthenticated}>
                            <ProfilePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <PublicRoute isAuthenticated={isAuthenticated}>
                            <LoginPage />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PublicRoute isAuthenticated={isAuthenticated}>
                            <RegisterPage />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/styles"
                        element={
                          <PrivateRoute isAuthenticated={isAuthenticated}>
                            <StylesPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/edit-profile"
                        element={
                          <PrivateRoute isAuthenticated={isAuthenticated}>
                            <EditProfilePage />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </Box>
              </Container>
            </BrowserRouter>
          </FilterProvider>
        </ToastProvider>
      </DialogProvider>
    </ThemeProvider>
  );
};

export default App;
