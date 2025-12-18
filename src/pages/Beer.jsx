import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Chip,
  Divider,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import useBeers from "../hooks/useBeers";
import { useAuth } from "../context/AuthContext";

import BusinessIcon from "@mui/icons-material/Business";
import ScienceIcon from "@mui/icons-material/Science";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReviewForm from "../components/customs/ReviewFrom";

const StatBar = ({ label, value, max }) => (
  <Box sx={{ mb: 1.5 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography variant="caption" fontWeight="bold">{label}</Typography>
      <Typography variant="caption" sx={{ color: "black", fontWeight: "bold" }}>
        {value ? value : 0} / {max}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={((value || 0) / max) * 100}
      sx={{
        height: 6,
        borderRadius: 4,
        bgcolor: "#fbc568ff",
        "& .MuiLinearProgress-bar": { bgcolor: "black" },
      }}
    />
  </Box>
);

const Beer = () => {
  const { id } = useParams();
  const { findBeer, beer, loading, saveReview, updateReview, deleteReview } = useBeers();
  const { user } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeReviewIdMenu, setActiveReviewIdMenu] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    findBeer(id);
  }, [id, findBeer]);

  const getScoreColor = (score) => {
    if (!score) return "#000000ff";
    if (score >= 7.5) return "#ffcc33";
    if (score >= 5) return "#ffcc33";
    return "#ffcc33";
  };

  const handleOpenMenu = (event, reviewId) => {
    setAnchorEl(event.currentTarget);
    setActiveReviewIdMenu(reviewId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveReviewIdMenu(null);
  };

  const handleEditFromMenu = () => {
    const reviewToEdit = beer.reviews.find(r => r.id === activeReviewIdMenu);
    if (reviewToEdit) {
        setEditingReview(reviewToEdit);
    }
    handleCloseMenu();
  };

  const handleDeleteFromMenu = async () => {
    if(window.confirm("Tem certeza que deseja apagar sua avaliação?")) {
        await deleteReview(activeReviewIdMenu, id);
    }
    handleCloseMenu();
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ aspectRatio: "16/9", width: "100%", bgcolor: "rgba(0,0,0,0.1)", borderRadius: 2 }} />
          ) : (
            <>
              <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 2, mb: 2, maxHeight: "500px", display: "flex", justifyContent: "center", bgcolor: "#f5f5f5" }}>
                {beer.image && <img src={beer.image} alt={beer.name} style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "500px" }} />}
                {beer.created_at && <Chip label={new Date(beer.created_at).getUTCFullYear()} sx={{ position: "absolute", top: 12, left: 12, bgcolor: "#f6b033", color: "black" }} />}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{ bgcolor: getScoreColor(beer.rating), color: "white", width: 50, height: 50, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "1.5rem", boxShadow: 2 }}>
                  {beer.rating || "-"}
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 0 }}>{beer.name}</Typography>
              </Box>

              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {beer.description || "Sem descrição disponível."}
              </Typography>
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>Avaliações da Comunidade</Typography>
                <Divider sx={{ mb: 3 }} />

                {!beer.reviews || beer.reviews.length === 0 ? (
                  <Typography color="text.secondary">Seja o primeiro a avaliar esta cerveja!</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {beer.reviews.map((review) => {

                      const isOwnerOrAdmin = user && (user.id === review.user_id || user.role === 1);

                      return (
                        <Grid item xs={12} key={review.id}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f6b033", position: 'relative' }}>
                            {isOwnerOrAdmin && (
                              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                                <IconButton
                                  aria-label="more"
                                  id={`long-button-${review.id}`}
                                  aria-haspopup="true"
                                  onClick={(e) => handleOpenMenu(e, review.id)}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(255,255,255,0.5)', '&:hover': { bgcolor: 'f6b033' } }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={review.profiles?.avatar_url} alt={review.profiles?.full_name || "Usuário"} sx={{ width: 32, height: 32, bgcolor: "white", color: "#f6b033", fontSize: "0.9rem", fontWeight: "bold" }}>
                                  {review.profiles?.full_name?.[0] || "U"}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "black", lineHeight: 1 }}>
                                      {review.profiles?.full_name || "Usuário"}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "black" }}>
                                      {new Date(review.created_at).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right', mr: isOwnerOrAdmin ? 5 : 0 }}>
                                  {review.price_paid && <Chip icon={<LocalOfferIcon style={{color: 'black'}} />} label={`R$ ${review.price_paid}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.5)', color: 'black', fontWeight: 'bold', mr: 0.5, mb: 0.5 }} />}
                                  {review.packaging && <Chip icon={<LocalDrinkIcon style={{color: 'black'}} />} label={review.packaging} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'black', mb: 0.5 }} />}
                              </Box>
                            </Box>
                            
                            <Typography variant="body1" sx={{ color: "black", mb: 2, mt: 1, fontWeight: 500 }}>
                              "{review.comment}"
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2, opacity: 0.8, color: "black", flexWrap: "wrap" }}>
                              <Typography variant="caption">👃 Aroma: <b>{review.aroma}</b>/10</Typography>
                              <Typography variant="caption">👅 Sabor: <b>{review.flavor}</b>/20</Typography>
                              <Typography variant="caption">👀 Aparência: <b>{review.appearance}</b>/5</Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Informações</Typography>
          <Divider sx={{ mb: 2, opacity: 0.6 }} />

          {loading ? (
            <Typography variant="body2">Carregando...</Typography>
          ) : (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <BusinessIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Cervejaria:</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "text.secondary", ml: 4 }}>{beer.brewery || "Não informada"}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>Estilo:</Typography>
                {beer.style ? <Chip label={beer.style} color="primary" /> : <Typography variant="body2" sx={{ color: "text.secondary" }}>Estilo não informado.</Typography>}
              </Box>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: "#F6B033", borderRadius: 2, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5, color: "black", mb: 0.5 }}>
                      <WaterDropIcon fontSize="small" />
                      <Typography variant="caption" fontWeight="bold">ABV</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="black">{beer.abv ? `${beer.abv}%` : "-"}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: "#F6B033", borderRadius: 2, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5, color: "black", mb: 0.5 }}>
                      <ScienceIcon fontSize="small" />
                      <Typography variant="caption" fontWeight="bold">IBU</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="black">{beer.ibu || "-"}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Avaliação Geral</Typography>
              <Divider sx={{ mb: 2, opacity: 0.6 }} />

              {beer.stats ? (
                <Box sx={{ bgcolor: "#f6b033", p: 2, borderRadius: 2, border: "1px solid #f6b033", mb: 4 }}>
                  <StatBar label="Aroma" value={beer.stats.avg_aroma} max={10} />
                  <StatBar label="Aparência" value={beer.stats.avg_appearance} max={5} />
                  <StatBar label="Sabor" value={beer.stats.avg_flavor} max={20} />
                  <StatBar label="Sensação" value={beer.stats.avg_mouthfeel} max={5} />
                  <StatBar label="Conjunto" value={beer.stats.avg_impression} max={10} />
                  <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: "text.secondary" }}>Baseado em {beer.reviews_count} avaliações</Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Sem dados suficientes.</Typography>
              )}

              <Box sx={{ mb: 4 }}>
                {!showReviewForm ? (
                    <Button variant="contained" color="primary" fullWidth startIcon={<RateReviewIcon />} onClick={() => setShowReviewForm(true)} sx={{ py: 1.5, fontWeight: "bold" }}>Avaliar esta Cerveja</Button>
                ) : (
                    <ReviewForm onSave={(data) => { saveReview(id, data); setShowReviewForm(false); }} onCancel={() => setShowReviewForm(false)} />
                )}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <Dialog open={Boolean(editingReview)} onClose={() => setEditingReview(null)} maxWidth="sm" fullWidth>
            <DialogContent>
                {editingReview && (
                    <ReviewForm
                        initialData={editingReview}
                        onSave={(data) => {
                            updateReview(editingReview.id, id, data);
                            setEditingReview(null);
                        }}
                        onCancel={() => setEditingReview(null)}
                    />
                )}
            </DialogContent>
      </Dialog>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditFromMenu}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteFromMenu} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

    </>
  );
};

export default Beer;