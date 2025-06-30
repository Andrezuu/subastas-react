import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Card,
  CardMedia,
  Stack,
} from "@mui/material";
import { Add, Remove, Gavel } from "@mui/icons-material";
import { useAuctionStore } from "../../stores/useAuctionStore";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { Timer } from "../../components/Timer";
import type { IAuction } from "../../interfaces/IAuction";

const AuctionInfo = ({ auction }: { auction: IAuction }) => {
  const { id } = useParams<{ id: string }>();
  const { timers } = useAppWebSocket();
  const timer = id ? timers[id] : undefined;

  const [bidAmount, setBidAmount] = useState(0);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  } | null>(null);

  if (!auction || !timer) {
    return <Typography>Cargando subasta...</Typography>;
  }

  const handleBid = async () => {
    if (bidAmount <= auction) {
      setNotification({
        open: true,
        message: "Tu oferta debe ser mayor al precio actual.",
        severity: "error",
      });
      return;
    }
    try {
      await placeBid(auction.id, bidAmount);
      setNotification({
        open: true,
        message: "¡Oferta realizada con éxito!",
        severity: "success",
      });
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.message || "No se pudo realizar la oferta.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Columna de Imagen */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={auction.img || "https://via.placeholder.com/600x400"}
              alt={auction.name}
              sx={{ width: "100%", height: "auto", maxHeight: 500 }}
            />
          </Card>
        </Grid>

        {/* Columna de Información y Puja */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            {auction.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {auction.description}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Temporizador */}
          <Typography variant="h6" gutterBottom>
            Tiempo restante:
          </Typography>
          <Timer
            days={timer.timeLeft.days}
            hours={timer.timeLeft.hours}
            minutes={timer.timeLeft.minutes}
            seconds={timer.timeLeft.seconds}
          />
          <Divider sx={{ my: 2 }} />

          {/* Sección de Puja */}
          <Typography variant="h6">
            Precio Actual:{" "}
            <Box component="span" fontWeight="bold" color="primary.main">
              ${auction.currentPrice.toFixed(2)}
            </Box>
          </Typography>

          {timer.timeLeft.expired ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Esta subasta ha finalizado. Ganador: {auction.winner || "N/A"} con
              ${auction.finalPrice?.toFixed(2)}
            </Alert>
          ) : (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => setBidAmount(bidAmount - 1)}
                  disabled={bidAmount <= auction.currentPrice + 1}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  sx={{ width: 100 }}
                  inputProps={{ step: "1" }}
                />
                <IconButton onClick={() => setBidAmount(bidAmount + 1)}>
                  <Add />
                </IconButton>
              </Stack>
              <Button
                variant="contained"
                size="large"
                startIcon={<Gavel />}
                onClick={handleBid}
              >
                Ofertar
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Notificaciones */}
      {notification && (
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default AuctionInfo;
