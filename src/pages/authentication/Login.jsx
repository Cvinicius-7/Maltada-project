import React from "react";
import { Grid, Stack, Avatar, TextField, Button, Typography } from "../../components";
import logo from '../../assets/images/Maltada2.png';



import styles from './styles';

const Login = () => {
  return (
    <Grid container spacing={2} sx={styles.gridOutter}>
      <Grid size={{ xs:0, sm:0, md:4, lg: 4}}/>
      <Grid size={{ xs:12, sm:12, md:4, lg: 4}} sx={{ ...styles.grid, ...styles.gridShadow }}>
        <Stack spacing={2} sx={styles.stack}>
          <Avatar sx={styles.avatar} src={logo}/>
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <Typography variant="h5">Bem vindo de volta!</Typography>
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <TextField label="E-mail" variant="standard" fullWidth />
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <TextField label="Senha" variant="standard" fullWidth type="password" />
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <a href="">Esqueci minha senha</a>
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <Button color="primary" variant="contained" fullWidth>Entrar</Button>
        </Stack>
        <Stack spacing={2} sx={styles.stack}>
          <Button color="secondary" variant="contained" fullWidth>Criar Conta</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Login;
