import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Skeleton,
  Chip,
  Divider,
  CardActionArea,
  Fab,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/SupabaseClient";
import BlogImage from "../components/customs/BlogImage";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";

const getInitials = (name) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReadPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <Box
        sx={{
          mb: 6,
          p: 4,
          textAlign: "center",
          borderRadius: 4,
          background: "linear-gradient(45deg, #1a1a1a 30%, #2c2c2c 90%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#f2a900" }}
        >
          Bem-vindo ao Maltada!
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", mb: 4 }}>
          Notícias, avaliações e a cultura cervejeira em um só lugar.
        </Typography>

        <Button
          variant="contained"
          size="large"
          color="warning"
          startIcon={<SportsBarIcon />}
          onClick={() => navigate("/beers")}
          sx={{
            borderRadius: 8,
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            textTransform: "none",
          }}
        >
          Explorar Catálogo de Cervejas
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <ArticleIcon sx={{ color: "#f2a900", mr: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          Últimas do Blog
        </Typography>
      </Box>
      <Divider sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.1)" }} />

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item key={n} xs={12} sm={6} md={4}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton width="60%" sx={{ mt: 1 }} />
              <Skeleton width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4}>
          {posts.map((post) => {
            let profileData = post.profiles;

            if (Array.isArray(profileData)) {
              profileData = profileData[0];
            }

            const authorName = profileData?.full_name || "Maltada Member";
            const avatarPath = profileData?.avatar_url;
            let avatarFullUrl = null;
            if (avatarPath) {
              if (avatarPath.startsWith("http")) {
                avatarFullUrl = avatarPath;
              } else {
                const { data } = supabase.storage
                  .from("images")
                  .getPublicUrl(avatarPath);
                avatarFullUrl = data.publicUrl;
              }
            }

            return (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#1e1e1e",
                    color: "#fff",
                    borderRadius: 3,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleReadPost(post.id)}
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <BlogImage
                      path={post.image_url}
                      height={180}
                      component="img"
                      alt={post.title}
                    />

                    <CardContent sx={{ width: "100%", flexGrow: 1 }}>
                      <Chip
                        label="Editorial"
                        size="small"
                        sx={{
                          mb: 1.5,
                          bgcolor: "rgba(242, 169, 0, 0.15)",
                          color: "#f2a900",
                          fontWeight: "bold",
                        }}
                      />

                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: "bold",
                          color: "#f2a900",
                          lineHeight: 1.2,
                          mb: 1,
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#aaa", mb: 3 }}>
                        {post.subtitle}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: "auto",
                          pt: 2,
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Avatar
                          src={avatarFullUrl}
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1.5,
                            bgcolor: "#f2a900",
                            fontSize: "0.9rem",
                            color: "#000",
                          }}
                        >
                          {getInitials(authorName)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "#888",
                              lineHeight: 1,
                            }}
                          >
                            Por
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontSize: "0.85rem", color: "#ddd" }}
                          >
                            {authorName}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Fab
        color="warning"
        aria-label="add"
        onClick={() => navigate("/new-post")}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          bgcolor: "#f2a900",
          "&:hover": { bgcolor: "#d49400" },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Home;
