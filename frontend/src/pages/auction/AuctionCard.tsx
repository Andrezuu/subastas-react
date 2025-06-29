import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface ImageProps {
  src: string;
  alt: string;
}
export const AuctionCard = ({ children }: { children: ReactNode }) => {
  return <Card>{children}</Card>;
};

const Image = ({ src, alt }: ImageProps) => {
  return <CardMedia component="img" image={src} alt={alt} />;
};
const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <Typography variant="body2" color="text.secondary">
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

// const Actions = ({ children }: { children: ReactNode }) => {
//   return children;
// };

// const Timer = ({ children }: { children: ReactNode }) => {
//   return children;
// };

AuctionCard.Footer = Footer;
AuctionCard.Title = Title;
AuctionCard.Image = Image;
// AuctionCard.Timer = Timer;
