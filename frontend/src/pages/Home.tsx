import { useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useAuctionStore } from "../store/useAuctionStore";
import { useTranslation } from "react-i18next";
import { AuctionCard } from "./auction/AuctionCard";
import { useAppWebSocket } from "../hooks/useWebSocket";
import { auctionTypes } from "../constants/auctionTypes";

function Home() {
  const auctions = useAuctionStore((state) => state.auctions);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  const { t } = useTranslation();
  const { timers, currentBids } = useAppWebSocket();

  useEffect(() => {
    fetchAuctions();
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
            const currentBid = currentBids[auction.id];

            return (
              <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={auction.id}>
                <AuctionCard auctionId={auction.id}>
                  <AuctionCard.ImageContainer>
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
                      />
                    )}
                  </AuctionCard.ImageContainer>

                  <Box
                    p={2}
                    sx={{ textAlign: "center", borderTop: "1px solid #eee" }}
                  >
                    <AuctionCard.Title>{auction.name}</AuctionCard.Title>

                    <AuctionCard.Footer>
                      {(() => {
                        if (!timer) return null;
                        switch (timer.type) {
                          case auctionTypes.PRESENT:
                            const displayPrice = currentBid
                              ? currentBid.amount
                              : auction.basePrice;
                            const priceLabel = currentBid
                              ? t("home.currentBid")
                              : t("home.basePrice");
                            return `${priceLabel} $${displayPrice.toFixed(2)}`;
                          case auctionTypes.PAST:
                            return t("home.pastAuction");
                          case auctionTypes.FUTURE:
                            return t("home.futureAuction");
                          default:
                            return null;
                        }
                      })()}
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
