import React from "react";
import {
  Button,
  CardMedia,
  Fab,
  Stack,
  TextField,
} from "../components";
import { useFilterContext } from "../context/FilterContext";
import useBeers from "../hooks/useBeers";
import AddIcon from "@mui/icons-material/Add";
import BeerCard from "../components/customs/BeerCard";
// Adicionado .js para garantir que importe o componente, não uma imagem
import EmptyState from "../components/customs/EmptyState.jsx"; 
import BeerCardSkeleton from "../components/customs/BeerCardSkeleton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box // <--- AQUI ESTAVA FALTANDO O BOX
} from "@mui/material";
import Authentication from "../services/Authentication";

const Home = () => {
  const { beers, listBeers, loading, saveBeer } = useBeers(); 
  const { filter } = useFilterContext();

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
    handleClose();
  };

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user
    : null;

  const isAdmin = user && user.role === 1;

  React.useEffect(() => {
    listBeers(filter.name.value ? filter : null, 50, 1);
  }, [filter, listBeers]);

  return (
    <>
      {/* A barra de filtro agora fica no AppBar, então removemos daqui */}

      {/* LAYOUT FLEXBOX (Substituindo o Grid para corrigir alinhamento) */}
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 2,
          marginLeft: '-16px', // Compensação visual
          width: 'calc(100% + 16px)'
        }}
      >
        {loading ? (
          Array.from({ length: 12 }).map((_, idx) => (
            <Box 
              key={idx}
              sx={{
                paddingLeft: '16px',
                paddingTop: '16px',
                // Responsividade: xs=1 coluna, sm=2, md=3, lg=4
                flexBasis: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                maxWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                boxSizing: 'border-box'
              }}
            >
              <BeerCardSkeleton />
            </Box>
          ))
        ) : beers.length === 0 ? (
          <Box sx={{ width: '100%', paddingLeft: '16px', paddingTop: '16px' }}>
            <EmptyState
              title="Nenhuma cerveja encontrada"
              subtitle="Tente outro termo de busca."
            />
          </Box>
        ) : (
          beers.map((beer) => (
            <Box 
              key={beer.id}
              sx={{
                paddingLeft: '16px',
                paddingTop: '16px',
                // Responsividade: xs=1 coluna, sm=2, md=3, lg=4
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