import React from "react";
import { useParams } from 'react-router-dom';
import { Box, Chip, Divider, Grid, Typography } from "@mui/material"; 
import useBeers from "../hooks/useBeers";

const Beer = () => {
  const { id } = useParams();
  const { findBeer, beer, loading } = useBeers();

  React.useEffect(() => {
    findBeer(id);
  }, [id, findBeer]);

  return (
    <>
      <Grid container spacing={3}>
        {/* COLUNA PRINCIPAL (Esquerda) */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ aspectRatio: '16/9', width: '100%', bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 }} />
          ) : (
            <>
              <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, mb: 2, maxHeight: '500px', display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                {beer.image && (
                    <img src={beer.image} alt={beer.name} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '500px' }} />
                )}
                {beer.created_at && (
                    <Chip label={new Date(beer.created_at).toLocaleDateString()} sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'white' }} />
                )}
              </Box>
              
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {beer.name}
              </Typography>
              
              {/* Aqui exibimos a descrição vinda do banco */}
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {beer.description || "Sem descrição disponível."}
              </Typography>
            </>
          )}
        </Grid>

        {/* COLUNA LATERAL (Direita) */}
        <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Informações</Typography>
            <Divider sx={{ mb: 2, opacity: .6 }} />

            {loading ? (
                <Typography variant="body2">Carregando...</Typography>
            ) : (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Estilo:</Typography>
                    {/* Agora 'beer.style' é uma string direta do seu banco */}
                    {beer.style ? (
                        <Chip label={beer.style} color="primary" />
                    ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Estilo não informado.</Typography>
                    )}
                </Box>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Avaliações</Typography>
            <Divider sx={{ mb: 2, opacity: .6 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nenhuma avaliação cadastrada ainda.</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Beer;