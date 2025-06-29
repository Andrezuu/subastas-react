import { useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useAuctionStore } from "../store/useAuctionStore";
import { AuctionCard } from "./auction/AuctionCard";

function Home() {
  const auctions = useAuctionStore((state) => state.auctions);
  const isLoading = useAuctionStore((state) => state.isLoading);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  useEffect(() => {
    fetchAuctions();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 4,
        }}
      >
        LATEST AUCTIONS
      </Typography>

      {auctions.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No hay subastas disponibles
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {auctions.map((auction) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={auction.id}>
              <AuctionCard>
                <AuctionCard.Image
                  // src={auction.img || "https://picsum.photos/300/200"}
                  src={"https://picsum.photos/300/200"}
                  alt={auction.name}
                />

                <Box p={2}>
                  <AuctionCard.Title>{auction.name}</AuctionCard.Title>

                  {/* <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {auction.description}
                  </Typography> */}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Precio base:
                      <Box
                        component="span"
                        fontWeight="bold"
                        color="primary.main"
                        ml={1}
                      >
                        ${auction.basePrice}
                      </Box>
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Duración: {Math.floor(auction.auctionDuration / 3600)}h{" "}
                      {Math.floor((auction.auctionDuration % 3600) / 60)}m
                    </Typography>
                  </Box>

                  <AuctionCard.Footer>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        textAlign: "center",
                        backgroundColor: getStatusColor(auction.auctionType),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {getStatusText(auction.auctionType)}
                    </Box>
                  </AuctionCard.Footer>
                </Box>
              </AuctionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

// Funciones auxiliares para el estado
const getStatusColor = (type: string) => {
  switch (type) {
    case "present":
      return "success.main";
    case "future":
      return "warning.main";
    case "past":
      return "error.main";
    default:
      return "grey.500";
  }
};

const getStatusText = (type: string) => {
  switch (type) {
    case "present":
      return "En curso";
    case "future":
      return "Próximamente";
    case "past":
      return "Finalizada";
    default:
      return "Estado desconocido";
  }
};

export default Home;
