import React from "react";
import {
  Button,
  CardMedia,
  DatePicker,
  Fab,
  Grid,
  Stack,
  TextField,
} from "../components";
import useBeers from "../hooks/useBeers";
import AddIcon from "@mui/icons-material/Add";
import useFilter from "../hooks/useFilter";
import Filter from "../components/customs/Filter";
import BeerCard from "../components/customs/BeerCard";
import EmptyState from "../components/customs/EmptyState";
import BeerCardSkeleton from "../components/customs/BeerCardSkeleton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Authentication from "../services/Authentication";

const Home = () => {
  // HOOKS ADAPTADOS
  const { beers, listBeers, loading, saveBeer } = useBeers(); // <-- 'loading' e 'saveBeer' adicionados
  const { filter, doFilter } = useFilter();

  // ESTADOS ADICIONADOS (Para o Modal)
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    name: "",
    description: "",
    image: null, // <-- Armazenará o File object
  });
  const [imagePreview, setImagePreview] = React.useState(""); // <-- Para o preview da imagem

  // FUNÇÕES ADICIONADAS (Para o Modal)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "", description: "", image: null }); // Limpa o formulário
    setImagePreview(""); // Limpa o preview
  };

  // LÓGICA DE UPLOAD DE IMAGEM (Adaptada para File Object + Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((values) => ({ ...values, image: file })); // Salva o File object
      setImagePreview(URL.createObjectURL(file)); // Cria um URL para o preview
    } else {
      setData((values) => ({ ...values, image: null }));
      setImagePreview("");
    }
  };

  // LÓGICA PARA SALVAR
  const handleSave = () => {
    // Passa 'data' (que contém o File object) para o saveBeer
    saveBeer(data, filter.name.value ? filter : null, 50, 1);
    handleClose(); // Fecha o modal
  };

  // VERIFICAÇÃO DE USUÁRIO (Para o botão de Adicionar)
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user
    : null;
  // (Assumindo que role 1 = admin, como no exemplo)
  const isAdmin = user && user.role === 1;

  // EFEITO INICIAL (Corrigido para 'filter.name.value')
  // EFEITO INICIAL
  React.useEffect(() => {
    listBeers(filter.title.value ? filter : null, 50, 1);
  }, [filter, listBeers]); // Adicionado 'listBeers' ao array de dependências

  return (
    <>
      <Button
        text="Logout"
        onClick={() => {
          Authentication.logout();
        }}
      >
        Sair
      </Button>

      <Filter label="Filtrar por Nome" filter={filter} doFilter={doFilter} />

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {loading ? (
          // 1. ESTADO DE CARREGAMENTO (LOADING)
          Array.from({ length: 12 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <BeerCardSkeleton />
            </Grid>
          ))
        ) : beers.length === 0 ? (
          // 2. ESTADO VAZIO
          <Grid item xs={12}>
            <EmptyState
              title="Nenhuma cerveja encontrada"
              subtitle="Tente outro termo de busca."
            />
          </Grid>
        ) : (
          // 3. ESTADO COM DADOS
          beers.map((beer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={beer.id}>
              <BeerCard beer={beer} />
            </Grid>
          ))
        )}
      </Grid>

      {/* BOTÃO FLUTUANTE DE ADICIONAR (FAB) */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed", // 'absolute' mudado para 'fixed'
            right: "20px",
            bottom: "20px",
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      )}

      {/* DIALOG (MODAL) PARA ADICIONAR CERVEJA */}
      <Dialog
        maxWidth={"lg"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Adicionar Nova Cerveja</DialogTitle>
        <DialogContent>
          <form>
            <Stack mt={2}>
              <TextField
                id="name"
                name="name"
                label="Nome da Cerveja"
                fullWidth
                value={data.name}
                onChange={(e) =>
                  setData((values) => ({
                    ...values,
                    name: e.target.value,
                  }))
                }
              />
            </Stack>
            <Stack mt={2}>
              <TextField
                id="description"
                name="description"
                label="Descrição"
                multiline
                rows={4}
                fullWidth
                value={data.description}
                onChange={(e) =>
                  setData((values) => ({
                    ...values,
                    description: e.target.value,
                  }))
                }
              />
            </Stack>
            <Stack mt={2}>
              <TextField
                id="image"
                name="image"
                type="file"
                fullWidth
                accept="image/png, image/jpeg" // Aceita apenas imagens
                onChange={handleImageChange} // Função adaptada
              />
              {/* PREVIEW DA IMAGEM */}
              {imagePreview && (
                <CardMedia
                  sx={{
                    height: "220px",
                    width: "400px",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    backgroundSize: "contain",
                    margin: "30px auto",
                  }}
                  image={imagePreview}
                />
              )}
            </Stack>
            {/* Removido o DatePicker de 'release_date' */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} autoFocus>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
