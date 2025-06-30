import { Card, CardMedia, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface ImageProps {
  src: string;
  alt: string;
}

interface TimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const AuctionCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: 345,
      }}
    >
      {children}
    </Card>
  );
};

const Image = ({ src, alt }: ImageProps) => {
  return <CardMedia component="img" height="200" image={src} alt={alt} />;
};
const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
};

const Description = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
};

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <Typography gutterBottom variant="h5" component="div">
      {children}
    </Typography>
  );
};

const Timer = ({
  days,
  hours,
  minutes,
  seconds,
  expired = false,
}: TimerProps & { expired?: boolean }) => {
  if (expired) {
    return (
      <Box sx={{ textAlign: "center", py: 2, backgroundColor: "#ffebee" }}>
        <Typography variant="body1" color="error" fontWeight="bold">
          Subasta Finalizada
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", py: 2, backgroundColor: "#f8f9fa" }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: "block" }}
      >
        Tiempo restante:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {days.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Días
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {hours.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Horas
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {minutes.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Min
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {seconds.toString().padStart(2, "0")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Seg
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

AuctionCard.Footer = Footer;
AuctionCard.Title = Title;
AuctionCard.Image = Image;
AuctionCard.Timer = Timer;
AuctionCard.Description = Description;
