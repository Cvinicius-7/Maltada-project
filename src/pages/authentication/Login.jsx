import React from "react";
import {
  Grid,
  Stack,
  Avatar,
  TextField,
  Button,
  Snackbar,
} from "../../components";
import logo from "../../assets/images/Maltada2.png";
import backgroundImage from "../../assets/images/BG1.jpg";
import { Typography } from "@mui/material";
import Authentication from "../../services/Authentication";
import Storage from "../../services/Storage";
import { modeloData } from "./modelo";

import styles from "./styles";
import { useToast } from "../../context/ToastContext";
import Database from "../../services/Database";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(modeloData);
  const [loading, setLoading] = React.useState(false);

const handleLogin = async () => {
    setLoading(true);
    setError(modeloData);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setError((prev) => ({
        ...prev,
        email: { message: "E-mail é obrigatório", show: true },
      }));
      return;
    }
    if (!emailRegex.test(email)) {
      setError((prev) => ({
        ...prev,
        email: { message: "E-mail inválido", show: true },
      }));
      return;
    }
    if (password === "") {
      setError((prev) => ({
        ...prev,
        password: { message: "Senha é obrigatória", show: true },
      }));
      return;
    }


    try {
      const { error } = await login(email, password); 

      if (error) {
        throw error;
      }
      
      showToast("Login realizado com sucesso!", "success");
      
      navigate("/");

    } catch (error) {
      if (error.message === "Invalid login credentials") {
        showToast("E-mail ou senha inválidos", "error");
      } else {
        showToast("Falha no login: " + error.message, "error");
      }
      console.error("Falha no login", error);
    }
    setLoading(false);
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={7}
        lg={7}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 4,
          flex: 1,
        }}
      >
        <Typography
          variant="h3"
          color="white"
          align="center"
          sx={{
            mb: 2,
            fontFamily: "Montserrat",
            fontSize: "3.5rem",
            fontWeight: 700,
          }}
        >
          Maltada!
        </Typography>
        <Typography
          variant="h6"
          color="white"
          align="center"
          sx={{ maxWidth: "80%", fontFamily: "Roboto", fontSize: "1.7rem" }}
        >
          A plataforma Cervejeira do Brasil
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={5}
        lg={5}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 4,
          flex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            borderRadius: "10px",
          }}
        >
          <Stack spacing={2} sx={styles.stack}>
            <Avatar src={logo} sx={styles.avatar} />
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <Typography
              variant="h5"
              component="div"
              align="center"
              sx={{ fontFamily: "roboto", fontWeight: 500 }}
            >
              Seja bem-vindo!
            </Typography>
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error.email.show}
              helperText={error.email.show ? error.email.message : ""}
              label="E-mail"
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password.show}
              helperText={error.password.show ? error.password.message : ""}
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <Button variant="text" size="small" sx={{ textTransform: "none" }}>
              Esqueci minha senha
            </Button>
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <Button
              loading={loading}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              Entrar
            </Button>
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <Link
              to="/register"
              style={{
                textAlign: "center",
                fontFamily: "Roboto",
                color: "#f6b033",
              }}
            >
              Criar conta
            </Link>
          </Stack>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
