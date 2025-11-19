import React from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

// --- Ícones ---
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScienceIcon from '@mui/icons-material/Science';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BiotechIcon from '@mui/icons-material/Biotech'; 
import RestaurantIcon from '@mui/icons-material/Restaurant'; 
import OpacityIcon from '@mui/icons-material/Opacity'; 

const Styles = () => {
  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
      {/* --- CABEÇALHO --- */}
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", color: "#f6b033", mb: 1, fontFamily: 'Montserrat' }}>
          Guia BJCP de Estilos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'Roboto' }}>
          Entendendo a anatomia e a avaliação técnica de uma cerveja.
        </Typography>
      </Box>

      {/* --- INTRODUÇÃO --- */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderLeft: "6px solid #f6b033", bgcolor: "#fafafa" }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>
          "Os estilos de cerveja não surgiram da noite para o dia; eles evoluíram ao longo do tempo devido à tecnologia, ingredientes disponíveis, água local, regulamentações e cultura. O BJCP (Beer Judge Certification Program) categoriza essas diferenças para criar um padrão de avaliação."
        </Typography>
      </Paper>

      {/* --- SEÇÃO 1: AVALIAÇÃO SENSORIAL --- */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 6, mb: 2 }}>
        Os 4 Pilares da Avaliação
      </Typography>
      <Typography paragraph sx={{ mb: 3 }}>
        Ao classificar uma cerveja, não dizemos apenas se é "boa" ou "ruim". Analisamos quatro categorias sensoriais distintas.
      </Typography>

      {/* 1. Aparência */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VisibilityIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1. Aparência</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            A aparência prepara o palco para a degustação. Avaliamos três pontos principais:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Cor" 
                secondary="Varia do amarelo palha (Pilsners) ao preto opaco (Imperial Stouts). É medida pela escala SRM (Standard Reference Method)." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Clareza" 
                secondary="A cerveja pode ser brilhante (cristalina), turva (como nas Weissbier ou Hazy IPAs) ou opaca. A turbidez nem sempre é um defeito; depende do estilo." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Espuma (Head)" 
                secondary="Avalia-se a retenção (quanto tempo dura), a textura (cremosa vs. bolhas grandes) e a cor da espuma." 
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 2. Aroma */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BiotechIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>2. Aroma</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            O olfato é responsável por grande parte do que percebemos como "sabor".
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Malte" 
                secondary="Pode trazer notas de pão, biscoito, caramelo, café, chocolate ou torrado." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Lúpulo" 
                secondary="Responsável por aromas cítricos, florais, herbais, pinho ou frutas tropicais." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Ésteres e Fenóis (Fermentação)" 
                secondary="A levedura cria aromas. Ésteres lembram frutas (banana na Weiss). Fenóis lembram especiarias (cravo, pimenta)." 
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* 3. Sabor */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <RestaurantIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>3. Sabor</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            O sabor confirma o aroma, mas adiciona novas dimensões. O principal ponto de avaliação é o <strong>Equilíbrio</strong>.
          </Typography>
          <Typography paragraph>
            Uma cerveja é "maltada" (doce) ou "lupulada" (amarga)? O final é seco ou doce? Existem sabores indesejados (off-flavors) como papelão (oxidação) ou manteiga (diacetil)?
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* 4. Sensação na Boca (Mouthfeel) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <OpacityIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>4. Sensação na Boca (Mouthfeel)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Não é sobre o gosto, mas sobre o tato.
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Corpo" secondary="A sensação de peso na língua (leve, médio, encorpado/viscoso)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Carbonatação" secondary="A 'picância' das bolhas. Pode ser baixa (Stouts inglesas) ou alta (Weiss, Espumantes)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Aquecimento" secondary="A sensação de calor na garganta causada pelo álcool." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Adstringência" secondary="A sensação de 'boca seca' ou cica, similar a morder a casca de uma uva." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* --- SEÇÃO 2: ESTATÍSTICAS VITAIS --- */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 6, mb: 3 }}>
        Estatísticas Vitais
      </Typography>
      <Typography paragraph>
        Para categorizar tecnicamente uma cerveja, usamos métricas precisas. Estas são as siglas que você verá nos rótulos.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', borderLeft: "4px solid #f6b033" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon fontSize="small" /> IBU (Bitterness)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>International Bitterness Units.</strong> Mede a concentração de ácidos do lúpulo. Quanto maior o número, mais amarga a cerveja. 
              <br/>Ex: American Lagers têm 8-12 IBU; IPAs podem ter 40-100+.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', borderLeft: "4px solid #d35400" }}>
             <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon fontSize="small" /> SRM (Color)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Standard Reference Method.</strong> A escala de cor.
              <br/>2-3: Amarelo Palha.
              <br/>10-15: Âmbar/Cobre.
              <br/>30-40+: Preto Opaco.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', borderLeft: "4px solid #27ae60" }}>
             <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon fontSize="small" /> ABV (Alcohol)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Alcohol by Volume.</strong> A porcentagem do volume total que é álcool puro. Cervejas variam comumente de 3% a 12%, mas podem ir além.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', borderLeft: "4px solid #2980b9" }}>
             <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon fontSize="small" /> OG & FG
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Original & Final Gravity.</strong> Mede a densidade do mosto antes e depois da fermentação. A diferença entre elas mostra quanto açúcar a levedura comeu (e transformou em álcool).
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* --- SEÇÃO 3: PRINCIPAIS ESTILOS --- */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 8, mb: 3 }}>
        Principais Estilos (O Básico)
      </Typography>
      <Typography paragraph sx={{ mb: 4 }}>
        O guia BJCP lista mais de 100 estilos, mas estes são os que você encontrará com mais frequência nas prateleiras e bares.
      </Typography>

      <Grid container spacing={3}>
        
        {/* Pilsner */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #f1c40f" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Pilsner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A rainha das cervejas. Dourada, cristalina e refrescante. Possui um amargor de lúpulo presente, mas limpo, e um final seco.
              <br/><br/>
              <strong>Exemplos:</strong> German Pils, Czech Premium Pale Lager.
            </Typography>
          </Paper>
        </Grid>

        {/* IPA */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #e67e22" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              IPA (India Pale Ale)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              O estilo que impulsionou a revolução artesanal. Focada no lúpulo, pode ser muito amarga e extremamente aromática (cítrico, pinho, frutas tropicais).
              <br/><br/>
              <strong>Exemplos:</strong> American IPA, Hazy IPA, English IPA.
            </Typography>
          </Paper>
        </Grid>

        {/* Stout / Porter */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #2c3e50" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Stout & Porter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cervejas escuras feitas com malte torrado. Espere sabores de café, chocolate amargo e caramelo queimado. Podem ser secas ou doces.
              <br/><br/>
              <strong>Exemplos:</strong> Irish Stout (Guinness), Imperial Stout.
            </Typography>
          </Paper>
        </Grid>

        {/* Weissbier */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #f39c12" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Weissbier (Trigo)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clássica alemã feita com pelo menos 50% de trigo. É turva, com espuma densa e aromas característicos de banana e cravo gerados pela levedura.
              <br/><br/>
              <strong>Exemplos:</strong> Weissbier, Dunkles Weissbier.
            </Typography>
          </Paper>
        </Grid>

        {/* Sour */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #e74c3c" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Sour / Wild Ale
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cervejas intencionalmente ácidas ou azedas. Podem ser refrescantes como uma limonada ou complexas e avinagradas. Muitas levam frutas.
              <br/><br/>
              <strong>Exemplos:</strong> Catharina Sour, Berliner Weisse, Lambic.
            </Typography>
          </Paper>
        </Grid>

        {/* Belgian Styles */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderTop: "6px solid #f1c40f" }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Escola Belga
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conhecidas pela complexidade da levedura, que traz notas frutadas e condimentadas. Geralmente são mais alcoólicas e muito carbonatadas.
              <br/><br/>
              <strong>Exemplos:</strong> Saison, Dubbel, Tripel, Witbier.
            </Typography>
          </Paper>
        </Grid>

      </Grid>
      
      {/* --- RODAPÉ --- */}
      <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.6 }}>
        <Typography variant="caption">
          Fonte: Beer Judge Certification Program (BJCP) Guidelines.
        </Typography>
      </Box>

    </Container>
  );
};

export default Styles;