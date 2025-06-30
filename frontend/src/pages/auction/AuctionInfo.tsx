import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import { BidForm } from "../../components/BidForm";
import { Timer } from "../../components/Timer";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { useAuctionStore } from "../../store/useAuctionStore";
import { auctionTypes } from "../../constants/auctionTypes";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/useUserStore";
import { useBidStore } from "../../store/useBidStore";

export const AuctionInfo = () => {
  const { t } = useTranslation();
  const { auctionId } = useParams<{ auctionId: string }>();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getUserById = useUserStore((state) => state.getUserById);

  // ✅ Usar bid store
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);

  const { timers } = useAppWebSocket();

  if (!auctionId) {
    return <Typography>Invalid auction ID</Typography>;
  }

  const auction = getAuctionById(auctionId);
  if (!auction) {
    return <Typography>Loading...</Typography>;
  }

  const timer = timers[auction.id];
  const currentBid = getCurrentBid(auctionId);
  const user = getUserById(currentBid?.userId || "");

  const isAuctionEnded = timer?.type === auctionTypes.PAST;

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

          {/* ✅ Solo mostrar timer si está activa */}
          {timer && timer.type === auctionTypes.PRESENT && !isAuctionEnded && (
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

          {currentBid && !isAuctionEnded && (
            <Typography variant="h6" color="primary">
              {t("home.currentBid")}: ${currentBid.amount}
            </Typography>
          )}

          {/* ✅ Mostrar resultado final mejorado */}
          {isAuctionEnded ? (
            <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
              <Typography variant="h5" color="success.main" gutterBottom>
                🎉 Auction Ended!
              </Typography>
              {user ? (
                <>
                  <Typography variant="h6">
                    Winner: {user.username || user.id}
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    Final Price: ${currentBid!.amount}
                  </Typography>
                </>
              ) : (
                <Typography>No bids were placed for this auction.</Typography>
              )}
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
