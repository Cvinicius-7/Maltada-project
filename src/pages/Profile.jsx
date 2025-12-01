import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useBeers from "../hooks/useBeers";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser).user : null;
  const { getUserReviews, loading } = useBeers();

  const [myReviews, setMyReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (userData?.id) {
      getUserReviews(userData.id).then((data) => setMyReviews(data));
    }
  }, []);

  if (!userData) {
    return <Typography>Carregando perfil...</Typography>;
  }

  const isAdmin = userData.role === 1;
  const roleLabel = isAdmin ? "Administrador" : "Cervejeiro";
  const roleColor = isAdmin ? "secondary" : "primary";
  const userInitial = userData.email ? userData.email[0].toUpperCase() : "U";

  const calculateAvg = (review) => {
    return (
      (review.aroma +
        review.appearance +
        review.flavor +
        review.mouthfeel +
        review.impression) /
      5
    ).toFixed(1);
  };
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f6b033" }}>
          Meu Perfil
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                src={userData.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#f6b033",
                  fontSize: "3.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  mb: 2,
                  color: "#fff",
                }}
              >
                {userInitial}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {userData.full_name || userData.email.split("@")[0]}
              </Typography>

              <Chip
                icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                label={roleLabel}
                color={roleColor}
                variant="outlined"
                sx={{ mt: 1, fontWeight: "bold" }}
              />
            </Box>

            <Divider sx={{ mb: 4 }}>Dados da Conta</Divider>

            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: "rgba(0,0,0,0.05)", color: "text.secondary" }}
                >
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    E-mail
                  </Typography>
                  <Typography variant="body1">{userData.email}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{ bgcolor: "rgba(0,0,0,0.05)", color: "text.secondary" }}
                >
                  <BadgeIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID de Usuário
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                  >
                    {userData.id}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Divider sx={{ my: 4 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonIcon />}
                onClick={() => navigate("/edit-profile")}
                sx={{ borderRadius: 2, px: 4, textTransform: "none" }}
              >
                Editar Dados
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ borderRadius: 2, px: 4, textTransform: "none" }}
              >
                Sair da Conta
              </Button>
            </Stack>
            <Divider sx={{ mb: 4, mt: 4 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <RateReviewIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Minhas Avaliações ({myReviews.length})
              </Typography>
            </Box>
            {loading ? (
              <Typography>Carregando avaliações...</Typography>
            ) : myReviews.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                Você ainda não avaliou nenhuma cerveja.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {myReviews.slice(0, visibleCount).map((review) => (
                  <Paper
                    key={review.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid #eee",
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f6af3370" },
                    }}
                    onClick={() => navigate(`/beer/${review.beer_id}`)}
                  >
                    <Avatar
                      src={review.beer?.image}
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: "rgba(0,0,0,0.05)",
                      }}
                    >
                      🍺
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {review.beer?.name || "Cerveja"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography fontWeight="bold" color="primary">
                            {calculateAvg(review)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / 10
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, fontStyle: "italic" }}
                      >
                        "{review.comment}"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avaliado em{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
                {myReviews.length > visibleCount && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      variant="text"
                      onClick={handleShowMore}
                      endIcon={<ExpandMoreIcon />}
                      sx={{ color: "text.secondary", textTransform: "none" }}
                    >
                      Mostrar avaliações anteriores (
                      {myReviews.length - visibleCount} restantes)
                    </Button>
                  </Box>
                )}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
