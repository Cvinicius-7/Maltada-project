import { Box, Chip, Typography } from '@mui/material';
import Card from '../default/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMedia from '../default/CardMedia';
import CardContent from '../default/CardContent';
import CardActions from '../default/CardActions';
import Button from '../default/Button';
import Fab from '../default/Fab';
// O <Stack> externo foi removido, pois ele era a causa do problema
import { useNavigate } from 'react-router-dom';

export default function BeerCard({ beer }) {
  const navigate = useNavigate();
  const goToDetails = () => navigate('/beer/' + beer.id);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user : null;

  return (
    // 1. O <Card> é o componente raiz, com position: 'relative'
    <Card
      sx={{
        position: 'relative', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      {/* 2. Os botões de Admin agora flutuam DENTRO do card */}
      { 
        user && user.role === 1 ? 
          <Box>
            <Fab size="small" color="secondary" aria-label="edit" sx={{
              position: 'absolute',
              left: 8,  // 8px da borda ESQUERDA
              top: 8,   // 8px da borda de CIMA
              zIndex: 10
            }}>
              <EditIcon />
            </Fab>
            <Fab size="small" color="error" aria-label="edit" sx={{
              position: 'absolute',
              left: 8,
              top: 56, // Posição do segundo botão
              zIndex: 10
            }}>
              <DeleteIcon />
            </Fab>
          </Box> : null
      }

      {/* 3. Área da Imagem (com 140px de altura e 'cover') */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 140 }}> 
        <CardMedia
          component="img"
          image={beer.image}
          alt={beer.name}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' // 'cover' corta o excesso
          }}
        />
        {beer.created_at && (
          <Chip
            size="small"
            label={new Date(beer.created_at).getFullYear()}
            color="secondary"
            // Movido para a DIREITA para não bater nos botões
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Conteúdo do Card */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {beer.name} 
        </Typography>
        {beer.description && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {beer.description}
          </Typography>
        )}
      </CardContent>
      
      {/* Botão de Ação */}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" onClick={goToDetails} fullWidth>
          Ver detalhes
        </Button>
      </CardActions>
    </Card>
  );
}