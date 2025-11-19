import React, { useState } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  alpha,
  styled,
} from "@mui/material";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import LogoutIcon from "@mui/icons-material/Logout";
import StyleIcon from "@mui/icons-material/Style";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFilterContext } from "../../context/FilterContext";

// --- ESTILOS DO CAMPO DE BUSCA (Estilo Material UI Moderno) ---
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // padding vertical + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const AppBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { doFilter } = useFilterContext(); // Pegando a função de filtrar global

  // Estados
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handlers do Menu de Usuário (Avatar)
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Handlers do Drawer (Menu Lateral)
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Conteúdo do Menu Lateral
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "#f6b033",
          color: "white",
        }}
      >
        <SportsBarIcon />
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Maltada!
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation("/styles")}>
            <ListItemIcon>
              <StyleIcon />
            </ListItemIcon>
            <ListItemText primary="Estilos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation("/profile")}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Meu Perfil" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar position="sticky" elevation={0} sx={{ bgcolor: "#2c2c2c" }}>
        {" "}
        {/* Fundo escuro para contraste */}
        <Toolbar>
          {/* 1. Ícone do Menu (Abre o Drawer) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* 2. Título (Clicável para ir à Home) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 800,
              color: "#f6b033",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Maltada!
          </Typography>

          {/* 3. Barra de Pesquisa Integrada */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar cerveja..."
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => doFilter("name", e.target.value)}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* 4. Área do Usuário */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              onClick={logout}
              sx={{ display: { xs: "none", md: "block" }, mr: 1 }}
            >
              Sair
            </Button>
            <Tooltip title="Configurações">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar alt="User" sx={{ bgcolor: "#f6b033" }}>
                  U
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Menu Dropdown do Usuário */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                <Typography textAlign="center">Perfil</Typography>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Typography textAlign="center">Sair</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </MuiAppBar>

      {/* O Componente Drawer (Menu Lateral Deslizante) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AppBar;
