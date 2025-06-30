import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import { BidForm } from "../../components/BidForm";
import { Timer } from "../../components/Timer";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { useAuctionStore } from "../../store/useAuctionStore";
import { auctionTypes } from "../../constants/auctionTypes";
import { useTranslation } from "react-i18next";

export const AuctionInfo = () => {
  const { t } = useTranslation();
  const { auctionId } = useParams<{ auctionId: string }>();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const { timers, currentBids, winners } = useAppWebSocket();

  if (!auctionId) {
    return <Typography>Invalid auction ID</Typography>;
  }

  const auction = getAuctionById(auctionId);

  if (!auction) {
    return <Typography>Loading...</Typography>;
  }

  const timer = timers[auction.id];
  const currentBid = currentBids[auction.id.toString()];
  const winner = winners[auction.id.toString()];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={auction.img || "https://picsum.photos/800/400"}
          alt={auction.name}
        />
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            {auction.name}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {auction.description}
          </Typography>

          {timer && timer.type === auctionTypes.PRESENT && (
            <Box mb={2}>
              <Typography variant="h6">{t("timer.title")}</Typography>
              <Timer
                days={timer.timeLeft.days}
                hours={timer.timeLeft.hours}
                minutes={timer.timeLeft.minutes}
                seconds={timer.timeLeft.seconds}
              />
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            {t("home.basePrice")}: ${auction.basePrice}
          </Typography>

          {currentBid && (
            <Typography variant="h6" color="primary">
              {t("home.currentBid")}: ${currentBid.amount}
            </Typography>
          )}

          {winner ? (
            <Box mt={2}>
              <Typography variant="h5" color="success.main">
                Auction Ended!
              </Typography>
              <Typography>
                {t("bid.winner")}: {t("bid.user")}
                {winner.userId}
              </Typography>
              <Typography>
                {t("bid.finalPrice")}: ${winner.amount}
              </Typography>
            </Box>
          ) : (
            <Box mt={3}>
              <BidForm />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};
