import React, { useState, useEffect } from "react";
import { 
  Container, 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Stack,
  IconButton
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { user } = JSON.parse(storedUser);
      setFullName(user.full_name || "");
      setImagePreview(user.avatar_url || "");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (!fullName.trim()) {
        showToast("O nome não pode estar vazio.", "error");
        setLoading(false);
        return;
    }

    const { success, error } = await updateProfile({ fullName, imageFile });

    if (success) {
      showToast("Perfil atualizado com sucesso!", "success");
      navigate("/profile");
    } else {
      showToast("Erro ao atualizar: " + error.message, "error");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton onClick={() => navigate('/profile')} sx={{ mr: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f6b033' }}>
            Editar Perfil
            </Typography>
        </Box>
        <Stack spacing={4} alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={imagePreview} 
              sx={{ width: 150, height: 150, border: '4px solid #f5f5f5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            />
            <IconButton 
              color="primary" 
              aria-label="upload picture" 
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              <PhotoCamera />
            </IconButton>
          </Box>
          <TextField
            label="Nome de Exibição"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            helperText="Como você aparecerá para outros usuários."
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditProfile;