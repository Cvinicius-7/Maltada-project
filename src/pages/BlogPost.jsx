import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, CircularProgress, 
  Paper, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../services/SupabaseClient';
import BlogImage from '../components/customs/BlogImage';
import { useAuth } from '../context/AuthContext'; 
import CommentsSection from '../components/customs/CommentsSection';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false); 

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Erro ao buscar o post:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="warning" /></Box>;
  if (!post) return <Box sx={{ textAlign: 'center', mt: 10, color: '#fff' }}><Typography variant="h5">Post não encontrado.</Typography></Box>;

  const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const isAuthor = user && (user.id === post.author_id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ color: '#aaa', '&:hover': { color: '#f2a900' } }}
        >
          Voltar para Home
        </Button>

        {isAuthor && (
          <Box>
            <Button 
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit-post/${post.id}`)}
              sx={{ color: '#f2a900', mr: 1, borderColor: '#f2a900' }}
              variant="outlined"
            >
              Editar
            </Button>
            <Button 
              startIcon={<DeleteIcon />}
              onClick={() => setOpenConfirm(true)}
              color="error"
              variant="outlined"
            >
              Excluir
            </Button>
          </Box>
        )}
      </Box>

      <Paper elevation={3} sx={{ bgcolor: '#1e1e1e', color: '#fff', borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', width: '100%', height: { xs: 200, md: 400 } }}>
            <BlogImage 
                path={post.image_url} 
                sx={{ position: 'absolute', top: 0, left: 0 }}
            />
            <Box sx={{ 
                position: 'absolute', bottom: 0, left: 0, width: '100%', 
                background: 'linear-gradient(to top, rgba(30,30,30,1), transparent)', 
                height: '100px' 
            }} />
        </Box>

        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Chip label="Maltada News" size="small" sx={{ bgcolor: '#f2a900', color: '#000', fontWeight: 'bold', mb: 2 }} />
          
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#f2a900' }}>
            {post.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', color: '#888', mb: 4 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{formattedDate}</Typography>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />

          <Typography variant="body1" component="div" sx={{ lineHeight: 1.8, color: '#ddd', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
            {post.content}
          </Typography>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 4 }} />
          <CommentsSection postId={post.id} />
          
        </Box>
      </Paper>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { bgcolor: '#2c2c2c', color: '#fff' } }}
      >
        <DialogTitle sx={{ color: '#f2a900' }}>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ccc' }}>
            Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} sx={{ color: '#aaa' }}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogPost;