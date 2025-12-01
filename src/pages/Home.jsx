import React from "react";
import {
  Button,
  CardMedia,
  Fab,
  Stack,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useFilterContext } from "../context/FilterContext";
import useBeers from "../hooks/useBeers";
import BeerCard from "../components/customs/BeerCard";
import EmptyState from "../components/customs/EmptyState.jsx";
import BeerCardSkeleton from "../components/customs/BeerCardSkeleton";

const stylesList = [
  "Todos",
  "Pilsen",
  "Lager",
  "Pale Ale",
  "IPA",
  "Stout",
  "Weiss",
  "Sour",
  "Witbier",
  "Bock",
  "Porter",
];

const Home = () => {
  const { beers, listBeers, loading, saveBeer, deleteBeer } = useBeers();
  const { filter, doFilter } = useFilterContext();
  const [open, setOpen] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState("name_asc");

  const [data, setData] = React.useState({
    name: "",
    description: "",
    brewery: "",
    style: "",
    year: "",
    image: null,
    currentImagePath: null,
  });
  const [imagePreview, setImagePreview] = React.useState("");
  const handleClickOpen = () => {
    setCurrentId(null);
    setData({
      name: "",
      description: "",
      brewery: "",
      style: "",
      year: "",
      image: null,
      currentImagePath: null,
    });
    setImagePreview("");
    setOpen(true);
  };

  const handleEdit = (beer) => {
    setCurrentId(beer.id);
    setData({
      name: beer.name,
      description: beer.description || "",
      brewery: beer.brewery || "",
      style: beer.style || "",
      year: beer.created_at ? new Date(beer.created_at).getFullYear() : "",
      image: null,
      currentImagePath: beer.image,
    });
    setImagePreview(beer.image);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cerveja?")) {
      deleteBeer(id, filter.name.value ? filter : null, 50, 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setData({
      name: "",
      description: "",
      brewery: "",
      style: "",
      year: "",
      image: null,
      currentImagePath: null,
    });
    setImagePreview("");
    setCurrentId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((values) => ({ ...values, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
    }
  };

  const handleSave = () => {
    saveBeer(data, filter.name.value ? filter : null, 50, 1, currentId);
    handleClose();
  };

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user
    : null;

  const isAdmin = user && user.role === 1;

  React.useEffect(() => {
    listBeers(filter, 50, 1, orderBy);
  }, [filter, listBeers, orderBy]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl
          size="small"
          sx={{ minWidth: 150, bgcolor: "transparent", borderRadius: 1 }}
        >
          <InputLabel id="style-select-label">Estilo</InputLabel>
          <Select
            labelId="style-select-label"
            value={filter.style?.value || "Todos"}
            label="Estilo"
            onChange={(e) =>
              doFilter(
                "style",
                e.target.value === "Todos" ? "" : e.target.value
              )
            }
          >
            {stylesList.map((style) => (
              <MenuItem key={style} value={style}>
                {style}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 200, bgcolor: "transparent", borderRadius: 1 }}
        >
          <InputLabel id="order-label">Ordenar por</InputLabel>
          <Select
            labelId="order-label"
            value={orderBy}
            label="Ordenar por"
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <MenuItem value="name_asc">Nome (A-Z)</MenuItem>
            <MenuItem value="name_desc">Nome (Z-A)</MenuItem>
            <MenuItem value="rating_desc">Maior Nota</MenuItem>
            <MenuItem value="rating_asc">Menor Nota</MenuItem>
            <MenuItem value="price_asc">Menor Preço Médio</MenuItem>
            <MenuItem value="price_desc">Maior Preço Médio</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: 2,
          marginLeft: "-16px",
          width: "calc(100% + 16px)",
        }}
      >
        {loading ? (
          Array.from({ length: 12 }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                paddingLeft: "16px",
                paddingTop: "16px",
                flexBasis: { xs: "100%", sm: "50%", md: "33.333%", lg: "25%" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.333%", lg: "25%" },
                boxSizing: "border-box",
              }}
            >
              <BeerCardSkeleton />
            </Box>
          ))
        ) : beers.length === 0 ? (
          <Box sx={{ width: "100%", paddingLeft: "16px", paddingTop: "16px" }}>
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
                paddingLeft: "16px",
                paddingTop: "16px",
                flexBasis: { xs: "100%", sm: "50%", md: "33.333%", lg: "25%" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.333%", lg: "25%" },
                boxSizing: "border-box",
              }}
            >
              <BeerCard
                beer={beer}
                onEdit={() => handleEdit(beer)}
                onDelete={() => handleDelete(beer.id)}
              />
            </Box>
          ))
        )}
      </Box>

      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", right: "20px", bottom: "20px" }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog
        maxWidth={"sm"}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {currentId ? "Editar Cerveja" : "Adicionar Nova Cerveja"}
        </DialogTitle>
        <DialogContent>
          <form>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Nome da Cerveja"
                fullWidth
                value={data.name}
                onChange={(e) =>
                  setData((v) => ({ ...v, name: e.target.value }))
                }
              />
              <TextField
                label="Cervejaria / Fabricante"
                fullWidth
                value={data.brewery}
                onChange={(e) =>
                  setData((v) => ({ ...v, brewery: e.target.value }))
                }
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Estilo"
                  fullWidth
                  value={data.style}
                  onChange={(e) =>
                    setData((v) => ({ ...v, style: e.target.value }))
                  }
                />
                <TextField
                  label="Ano de Criação"
                  type="number"
                  sx={{ width: "150px" }}
                  value={data.year}
                  onChange={(e) =>
                    setData((v) => ({ ...v, year: e.target.value }))
                  }
                />
              </Stack>
              <TextField
                label="Descrição"
                multiline
                rows={4}
                fullWidth
                value={data.description}
                onChange={(e) =>
                  setData((v) => ({ ...v, description: e.target.value }))
                }
              />
              <TextField
                type="file"
                fullWidth
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <CardMedia
                  sx={{
                    height: "200px",
                    width: "100%",
                    borderRadius: "8px",
                    backgroundSize: "contain",
                  }}
                  image={imagePreview}
                />
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" autoFocus>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
