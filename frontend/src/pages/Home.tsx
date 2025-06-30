import { use, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useAuctionStore } from "../store/useAuctionStore";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useTranslation } from "react-i18next";
import { severities } from "../constants/severities";
import { AuctionCard } from "./auction/AuctionCard";
import { useWebSocket } from "../hooks/useWebSocket";
import { auctionTypes } from "../constants/auctionTypes";

function Home() {
  const auctions = useAuctionStore((state) => state.auctions);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  const { t } = useTranslation();
  const { timers } = useWebSocket();
  const getStatusColor = (type: string) => {
    switch (type) {
      case auctionTypes.PRESENT:
        return "success.main";
      case auctionTypes.FUTURE:
        return "warning.main";
      case auctionTypes.PAST:
        return "error.main";
      default:
        return "grey.500";
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case auctionTypes.PRESENT:
        return t("home.presentAuction");
      case auctionTypes.FUTURE:
        return t("home.futureAuction");
      case auctionTypes.PAST:
        return t("home.pastAuction");
      default:
        return "Estado desconocido";
    }
  };

  useEffect(() => {
    fetchAuctions();
    console.log("Timers from Home:", timers[1]);
  }, []);

  return (
    <Box p={3}>
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        {t("home.title")}
      </Typography>

      {auctions.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            {t("home.noAuctions")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {auctions.map((auction) => {
            const timer = timers[auction.id];

            return (
              <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={auction.id}>
                <AuctionCard>
                  <AuctionCard.Image
                    src={auction.img || "https://picsum.photos/300/200"}
                    alt={auction.name}
                  />

                  {timer && timer.type === auctionTypes.PRESENT && (
                    <AuctionCard.Timer
                      days={timer.timeLeft.days}
                      hours={timer.timeLeft.hours}
                      minutes={timer.timeLeft.minutes}
                      seconds={timer.timeLeft.seconds}
                      expired={timer.timeLeft.expired}
                    />
                  )}

                  <Box p={2}>
                    <AuctionCard.Title>{auction.name}</AuctionCard.Title>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {auction.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("home.basePrice")}
                        <Box
                          component="span"
                          fontWeight="bold"
                          color="primary.main"
                          ml={1}
                        >
                          ${auction.basePrice}
                        </Box>
                      </Typography>
                    </Box>

                    <AuctionCard.Footer>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          textAlign: "center",
                          backgroundColor: getStatusColor(timer && timer.type),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {getStatusText(timer && timer.type)}
                      </Box>
                    </AuctionCard.Footer>
                  </Box>
                </AuctionCard>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default Home;
