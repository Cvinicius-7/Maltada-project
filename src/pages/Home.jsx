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
  Box
} from "@mui/material";
import Authentication from "../services/Authentication";

const Home = () => {
  const { beers, listBeers, loading, saveBeer } = useBeers(); 
  const { filter, doFilter } = useFilter();

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    name: "",
    description: "",
    image: null, 
  });
  const [imagePreview, setImagePreview] = React.useState(""); 

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setData({ name: "", description: "", image: null }); 
    setImagePreview("");
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((values) => ({ ...values, image: file })); 
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      setData((values) => ({ ...values, image: null }));
      setImagePreview("");
    }
  };


  const handleSave = () => {
    saveBeer(data, filter.name.value ? filter : null, 50, 1);
    handleClose(); // Fecha o modal
  };

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user
    : null;

  const isAdmin = user && user.role === 1;


  React.useEffect(() => {
    listBeers(filter.title.value ? filter : null, 50, 1);
  }, [filter, listBeers]);

  return (
    <>
      <Filter label="Filtrar por Nome" filter={filter} doFilter={doFilter} />

      {/* MUDANÇA AQUI: Trocamos <Grid container> por <Box>
        - Usamos 'display: flex' e 'flexWrap: wrap' para simular o grid.
        - Usamos margem negativa (marginLeft: -2) e (marginTop: 0) para
          recriar o 'spacing={2}' do <Grid container>.
      */}
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 2,
          // Recriando o spacing={2} (16px)
          marginLeft: '-16px', 
          width: 'calc(100% + 16px)'
        }}
      >
        {loading ? (

          Array.from({ length: 12 }).map((_, idx) => (
            // MUDANÇA AQUI: Trocamos <Grid item> por <Box>
            <Box 
              key={idx}
              sx={{
                paddingLeft: '16px', // spacing
                paddingTop: '16px',  // spacing
                // Recriando xs={12} sm={6} md={4} lg={3}
                flexBasis: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                maxWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                boxSizing: 'border-box' // Impede que o padding quebre o layout
              }}
            >
              <BeerCardSkeleton />
            </Box>
          ))
        ) : beers.length === 0 ? (
          // O EmptyState precisa ter 100% de largura
          <Box sx={{ width: '100%', paddingLeft: '16px', paddingTop: '16px' }}>
            <EmptyState
              title="Nenhuma cerveja encontrada"
              subtitle="Tente outro termo de busca."
            />
          </Box>
        ) : (
          beers.map((beer) => (
            // MUDANÇA AQUI: Trocamos <Grid item> por <Box>
            <Box 
              key={beer.id}
              sx={{
                paddingLeft: '16px', // spacing
                paddingTop: '16px',  // spacing
                // Recriando os números corretos: xs={12} sm={6} md={4} lg={3}
                flexBasis: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                maxWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                boxSizing: 'border-box'
              }}
            >
              <BeerCard beer={beer} />
            </Box>
          ))
        )}
      </Box>
      
      {/* O resto do seu código (Fab, Dialog) continua o mesmo */}

      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      )}
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
                accept="image/png, image/jpeg" 
                onChange={handleImageChange} 
              />
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
