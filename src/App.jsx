import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './pages/authentication/Login';
import Home from './pages/Home';
import Register from "./pages/authentication/Register";


import Authentication from './services/Authentication'; 

const theme = createTheme({
  palette: {
    primary: {
      main: "#f6b033",
    },
    secondary: {
      main: "#f6bc338a",
    },
  },
});

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    const checkAuth = async () => {
      try {
        const auth = await Authentication.isAuthenticated();
        setIsAuthenticated(auth);
      } catch (error) {
        console.error("Falha ao verificar autenticação:", error);

        setIsAuthenticated(false);
      }
    }

    React.useEffect(() => {
        checkAuth();
    }, []);

    return (
      <ThemeProvider theme={theme}>
        {
            isAuthenticated === null ? (
              <h1>Carregando...</h1> 
            ) : (
              isAuthenticated ? <Home /> : <Login />
            )
        }
      </ThemeProvider>
    );
}

export default App;