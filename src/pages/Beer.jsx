import { Button } from "../components";
import Authentication from "../services/Authentication";
import { Grid, Typography } from "../components";
import useBeers from "../hooks/useBeers";
import { Box, Chip, Divider } from "@mui/material";
import React from "react";
import { useParams } from 'react-router-dom'; 

const Beer = (props) => {
 
  const { id } = useParams();

  const { findBeer, beer, loading } = useBeers();

  React.useEffect(() => {
    findBeer(id);
  }, [findBeer, id]);

  console.log(beer);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box
              sx={{
                aspectRatio: "16/9",
                width: "100%",
                bgcolor: "action.hover",
                borderRadius: 2,
              }}
            />
          ) : (
            <>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <img
                  src={beer.image}
                  alt={beer.name}
                  style={{ width: "100%", display: "block" }}
                />
                <Chip
                  label={
                    beer.created_at
                      ? new Date(beer.created_at).toLocaleDateString()
                      : ""
                  }
                  sx={{ position: "absolute", top: 12, left: 12 }}
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                {beer.name} 
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {beer.description}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Beer;