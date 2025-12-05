import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import Bucket from "../services/Bucket";
import BlogImage from "../components/customs/BlogImage";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
  });
  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content,
        });
        setCurrentImagePath(data.image_url);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

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

  const handleRemoveNewImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImagePath = currentImagePath;

      if (imageFile) {
        const fileName = `${Date.now()}-${Bucket.generateNameFile(
          imageFile.name
        )}`;
        finalImagePath = await Bucket.upload("images", fileName, imageFile);
      }

      const { error } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.content,
          image_url: finalImagePath,
        })
        .eq("id", id);

      if (error) throw error;

      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="warning" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/post/${id}`)}
        sx={{ mb: 3, color: "#aaa", "&:hover": { color: "#f2a900" } }}
      >
        Cancelar Edição
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
          Editar Artigo
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
            <Typography variant="subtitle2" sx={{ mb: 2, color: "#aaa" }}>
              Capa do Artigo
            </Typography>

            {(previewUrl || currentImagePath) && (
              <Box
                sx={{ mb: 2, position: "relative", display: "inline-block" }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="New Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      display: "inline-block",
                    }}
                  >
                    <BlogImage
                      path={currentImagePath}
                      height={300}
                      component="img"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                )}

                {previewUrl && (
                  <IconButton
                    onClick={handleRemoveNewImage}
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "error.main",
                      color: "#fff",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{
                display: "block",
                margin: "0 auto",
                color: "#aaa",
                borderColor: "#444",
                "&:hover": { borderColor: "#f2a900", color: "#f2a900" },
              }}
            >
              {currentImagePath || previewUrl
                ? "Alterar Imagem"
                : "Adicionar Imagem"}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
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
            disabled={saving}
            startIcon={
              saving ? (
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
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPost;
