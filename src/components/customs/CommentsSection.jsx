import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, ListItemAvatar, 
  ListItemText, Avatar, IconButton, Divider, Paper, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../services/SupabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CommentsSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) throw new Error("Usuário não logado");

      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment,
          post_id: postId,
          author_id: currentUser.id
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(); 
    } catch (error) {
      console.error('Erro ao comentar:', error);
      alert('Erro ao enviar comentário.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    return data.publicUrl;
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography variant="h5" sx={{ color: '#f2a900', mb: 3, fontWeight: 'bold' }}>
        Comentários ({comments.length})
      </Typography>
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#2c2c2c', borderRadius: 2 }}>
        {isAuthenticated ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Deixe sua opinião sobre esta cerveja ou artigo..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              maxRows={3}
              sx={{ 
                '& .MuiOutlinedInput-root': { color: '#fff', bgcolor: '#1e1e1e' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="warning"
              disabled={submitting || !newComment.trim()}
              sx={{ minWidth: '50px', height: '56px', borderRadius: 1 }}
            >
              {submitting ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 2 }}>
              Você precisa estar logado para comentar.
            </Typography>
            <Button variant="outlined" color="warning" onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </Box>
        )}
      </Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress color="warning" /></Box>
      ) : (
        <List>
          {comments.map((comment) => {
            let profile = comment.profiles;
            if (Array.isArray(profile)) profile = profile[0];
            const authorName = profile?.full_name || 'Maltada Member';
            const avatarUrl = getAvatarUrl(profile?.avatar_url);
            
            const isMyComment = user && (user.id === comment.author_id);

            return (
              <React.Fragment key={comment.id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    isMyComment && (
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(comment.id)} sx={{ color: '#666', '&:hover': { color: '#f44336' } }}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                  sx={{ px: 0 }}
                >
                  <ListItemAvatar>
                    <Avatar src={avatarUrl} sx={{ bgcolor: '#f2a900', color: '#000' }}>
                      {getInitials(authorName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Typography sx={{ color: '#f2a900', fontWeight: 'bold', fontSize: '0.95rem' }}>
                            {authorName}
                         </Typography>
                         <Typography variant="caption" sx={{ color: '#666', mr: 2 }}>
                            {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                         </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: 'inline', color: '#ddd', whiteSpace: 'pre-line' }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              </React.Fragment>
            );
          })}
          
          {comments.length === 0 && !loading && (
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mt: 2 }}>
              Seja o primeiro a comentar!
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default CommentsSection;