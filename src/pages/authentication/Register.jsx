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
import { modeloData } from "./modelo";

import styles from "./styles";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(modeloData);
  const [loading, setLoading] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError(modeloData);

    if (displayName.trim() === "") {
      setError((prev) => ({
        ...prev,
      }));
      showToast("Nome é obrigatório", "error");
      setLoading(false);
      return;
    }

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
    if (password.length < 8) {
      setError((prev) => ({
        ...prev,
        password: {
          message: "Senha deve ter pelo menos 8 caracteres",
          show: true,
        },
      }));
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!passwordRegex.test(password)) {
      setError((prev) => ({
        ...prev,
        password: {
          message:
            "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
          show: true,
        },
      }));
      return;
    }
    if (confirmPassword === "") {
      setError((prev) => ({
        ...prev,
        confirmPassword: {
          message: "Confirmação de senha é obrigatória",
          show: true,
        },
      }));
      return;
    }
    if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: { message: "As senhas não coincidem", show: true },
      }));
      return;
    }
    try {
      const { data, error } = await register(email, password, displayName);
      if (error) {
        throw error;
      }
      showToast("Registro realizado com sucesso!", "success");
      navigate("/login");
    } catch (error) {
      showToast("Falha no registro: " + error.message, "error");
      console.error("Falha no registro", error);
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
          Venha apreciar o melhor da comunidade cervejeira brasileira!
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
          <Stack spacing={3} sx={styles.stack}>
            <Avatar src={logo} sx={styles.avatar} />
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <Typography
              variant="h5"
              component="div"
              align="center"
              sx={{ fontFamily: "roboto", fontWeight: 500 }}
            >
              Crie sua conta!
            </Typography>
          </Stack>
          <Stack spacing={2} sx={styles.stack}>
            <TextField
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              label="Nome de Usuário"
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-mail"
              variant="outlined"
              error={error.email.show}
              helperText={error.email.show ? error.email.message : ""}
              fullWidth
            />
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Senha"
              type="password"
              error={error.password.show}
              helperText={error.password.show ? error.password.message : ""}
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirmar senha"
              type="password"
              error={error.confirmPassword.show}
              helperText={
                error.confirmPassword.show ? error.confirmPassword.message : ""
              }
              variant="outlined"
              fullWidth
            />
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <Button
              loading={loading}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRegister}
            >
              Cadastrar
            </Button>
          </Stack>
          <Stack spacing={3} sx={styles.stack}>
            <Link
              to="/login"
              style={{
                textAlign: "center",
                fontFamily: "Roboto",
                color: "#f6b033",
              }}
            >
              Entrar
            </Link>
          </Stack>
        </div>
      </Grid>
    </Grid>
  );
};

export default Register;
