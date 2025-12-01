import { Box, Chip, Typography } from '@mui/material';
import Card from '../default/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMedia from '../default/CardMedia';
import CardContent from '../default/CardContent';
import CardActions from '../default/CardActions';
import Button from '../default/Button';
import Fab from '../default/Fab';
import { useNavigate } from 'react-router-dom';


const getScoreColor = (score) => {
  if (!score) return '#ccc';
  if (score >= 7.5) return '#66cc33';
  if (score >= 5) return '#ffcc33';
  return '#ff4444';
};

export default function BeerCard({ beer }) {
  const navigate = useNavigate();
  const goToDetails = () => navigate('/beer/' + beer.id);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user : null;

  return (
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
      { 
        user && user.role === 1 ? 
          <Box>
            <Fab size="small" color="secondary" aria-label="edit" sx={{
              position: 'absolute', left: 8, top: 8, zIndex: 10
            }}>
              <EditIcon />
            </Fab>
            <Fab size="small" color="error" aria-label="edit" sx={{
              position: 'absolute', left: 8, top: 56, zIndex: 10
            }}>
              <DeleteIcon />
            </Fab>
          </Box> : null
      }

      <Box sx={{ position: 'relative', overflow: 'hidden', height: 140 }}> 
        <CardMedia
          component="img"
          image={beer.image}
          alt={beer.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {beer.created_at && (
          <Chip
            size="small"
            label={new Date(beer.created_at).getUTCFullYear()}
            color="secondary"
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }}
          />
        )}
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: getScoreColor(beer.rating),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                minWidth: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '8px',
                boxShadow: '-2px -2px 5px rgba(0,0,0,0.2)',
                zIndex: 5
            }}
         >
            {beer.rating || '-'}
         </Box>
      </Box>
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
      
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" onClick={goToDetails} fullWidth>
          Ver detalhes
        </Button>
      </CardActions>
    </Card>
  );
}