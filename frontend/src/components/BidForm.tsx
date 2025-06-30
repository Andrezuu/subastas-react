import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useBidForm } from "../hooks/useBidForm";
import { useEffect } from "react";

export const BidForm = () => {
  const { t } = useTranslation();


  const { formik, bidError, minimumBid, currentBid, currentBidUser } = useBidForm();

  useEffect(() => {
    console.log("Current Bid User:", currentBidUser);
    console.log("Current Bid:", currentBid);
  }, []);

  if (currentBidUser) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2, textAlign: "center" }}>
        <Typography variant="h5" color="success.main" gutterBottom>
          🎉 {t("bid.auctionEnded") || "Auction Ended!"}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("bid.winner")}: {currentBidUser?.username || currentBidUser.id}
        </Typography>
        <Chip
          label={`${t("bid.finalPrice") || "Final Price"}: $${
            currentBid.amount
          }`}
          color="success"
        />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("bid.placeBid")}
      </Typography>

      {/* ✅ Mostrar bid actual si existe */}
      {currentBid && (
        <Box mb={2} p={2} bgcolor="info.light" borderRadius={1}>
          <Typography variant="subtitle2">
            {t("bid.currentHighest") || "Current Highest Bid:"}
          </Typography>
          <Typography variant="h6" color="primary">
            ${currentBid.amount}
          </Typography>
          {currentBidUser && (
            <Typography variant="body2" color="text.secondary">
              {t("bid.by") || "by"} {currentBidUser.username}
            </Typography>
          )}
        </Box>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            name="amount"
            label={t("bid.amount") || "Bid Amount"}
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={
              formik.touched.amount && formik.errors.amount
                ? formik.errors.amount
                : `${t("bid.minimumBid")}: $${minimumBid}`
            }
            inputProps={{
              min: minimumBid + 1,
              step: "0.01",
            }}
            disabled={formik.isSubmitting}
          />

          {bidError && <Alert severity="error">{bidError}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting
              ? t("bid.placing") || "Placing Bid..."
              : t("bid.placeBid")}
          </Button>

          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              {t("bid.realTimeInfo") || "Bids are updated in real-time"}
            </Typography>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
