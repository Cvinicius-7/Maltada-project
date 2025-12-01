import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Stack,
  Paper,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const ReviewSlider = ({ label, value, max, onChange }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" color="primary" fontWeight="bold">
        {value}/{max}
      </Typography>
    </Box>
    <Slider
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      min={0}
      max={max}
      step={1}
      valueLabelDisplay="auto"
      sx={{ color: "#ffffff", height: 6 }}
    />
  </Box>
);

const packagingOptions = [
  "Garrafa (Long Neck)",
  "Garrafa (600ml)",
  "Garrafa (1L)",
  "Lata (350ml)",
  "Lata (473ml)",
  "Barril / Chopp (On Tap)",
  "Growler",
  "Outro",
];
const ReviewForm = ({ onSave, onCancel }) => {
  const [scores, setScores] = useState({
    aroma: 5,
    appearance: 3,
    flavor: 10,
    mouthfeel: 3,
    impression: 5,
  });
  const [details, setDetails] = useState({
    comment: "",
    packaging: "Garrafa (Long Neck)", // Valor padrão
    price_paid: "",
  });

  const handleSubmit = () => {
    onSave({
      ...scores,
      comment: details.comment,
      packaging: details.packaging,
      price_paid: details.price_paid,
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        bgcolor: "#f6b033",
        borderRadius: 2,
        border: "1px solid #f6b033",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Escreva sua Avaliação
      </Typography>
      <ReviewSlider
        label="👃 Aroma (0-10)"
        value={scores.aroma}
        max={10}
        onChange={(v) => setScores({ ...scores, aroma: v })}
      />
      <ReviewSlider
        label="👀 Aparência (0-5)"
        value={scores.appearance}
        max={5}
        onChange={(v) => setScores({ ...scores, appearance: v })}
      />
      <ReviewSlider
        label="👅 Sabor (0-20)"
        value={scores.flavor}
        max={20}
        onChange={(v) => setScores({ ...scores, flavor: v })}
      />
      <ReviewSlider
        label="👄 Sensação na Boca (0-5)"
        value={scores.mouthfeel}
        max={5}
        onChange={(v) => setScores({ ...scores, mouthfeel: v })}
      />
      <ReviewSlider
        label="🧠 Impressão Geral (0-10)"
        value={scores.impression}
        max={10}
        onChange={(v) => setScores({ ...scores, impression: v })}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2, mt: 3 }}
      >
        {/* Seleção de Envasamento */}
        <TextField
          select
          label="Embalagem / Tipo"
          fullWidth
          value={details.packaging}
          onChange={(e) =>
            setDetails({ ...details, packaging: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalBarIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        >
          {packagingOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* Campo de Preço */}
        <TextField
          label="Preço Pago (R$)"
          type="number"
          fullWidth
          placeholder="0.00"
          value={details.price_paid}
          onChange={(e) =>
            setDetails({ ...details, price_paid: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <TextField
        label="Comentário (Opcional)"
        placeholder="O que você achou dessa cerveja?"
        multiline
        rows={3}
        fullWidth
        value={details.comment}
        onChange={(e) => setDetails({ ...details, comment: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel} color="inherit">
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Publicar Avaliação
        </Button>
      </Stack>
    </Paper>
  );
};
export default ReviewForm;
