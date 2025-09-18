import Register from "./pages/authentication/Register";
import { ThemeProvider, createTheme } from '@mui/material/styles';


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
  return <ThemeProvider theme={theme}>
    <Register/>
  </ThemeProvider>
}

export default App;