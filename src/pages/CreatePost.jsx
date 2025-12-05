import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import Bucket from "../services/Bucket";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath = null;

      if (imageFile) {
        const fileName = `${Date.now()}-${Bucket.generateNameFile(
          imageFile.name
        )}`;
        imagePath = await Bucket.upload("images", fileName, imageFile);
      }
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      const authorId = user?.id || supabaseUser?.id;

      const { error } = await supabase.from("posts").insert({
        title: formData.title,
        subtitle: formData.subtitle,
        content: formData.content,
        image_url: imagePath,
        author_id: authorId,
      });

      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Erro ao criar o post. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, color: "#aaa", "&:hover": { color: "#f2a900" } }}
      >
        Voltar
      </Button>

      <Paper
        elevation={3}
        sx={{ p: 4, bgcolor: "#1e1e1e", color: "#fff", borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#f2a900", fontWeight: "bold" }}
        >
          Novo Artigo
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "#aaa" }}>
          Compartilhe suas experiências etílicas com a comunidade.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
              p: 2,
              border: "2px dashed #444",
              borderRadius: 2,
            }}
          >
            {previewUrl ? (
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "error.main",
                    color: "#fff",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{
                  color: "#aaa",
                  borderColor: "#444",
                  py: 4,
                  width: "100%",
                  "&:hover": { borderColor: "#f2a900", color: "#f2a900" },
                }}
              >
                Adicionar Imagem de Capa
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </Button>
            )}
          </Box>

          <TextField
            fullWidth
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#f2a900" },
              },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          />

          <TextField
            fullWidth
            label="Subtítulo (Resumo)"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#f2a900" },
              },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          />

          <TextField
            fullWidth
            label="Conteúdo"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={10}
            variant="outlined"
            placeholder="Escreva seu texto aqui. Você pode usar parágrafos..."
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#f2a900" },
              },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              bgcolor: "#f2a900",
              color: "#000",
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { bgcolor: "#d49400" },
            }}
          >
            {loading ? "Publicando..." : "Publicar Artigo"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
