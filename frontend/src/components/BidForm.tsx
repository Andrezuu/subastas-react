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
import { useAppWebSocket } from "../hooks/useWebSocket";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBidForm } from "../hooks/useBidForm";

export const BidForm = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { t } = useTranslation();
  const { winners } = useAppWebSocket();
  const { formik, bidError, minimumBid } = useBidForm();

  const winner = winners[auctionId || ""];

  if (winner) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2, textAlign: "center" }}>
        <Typography variant="h5" color="success.main" gutterBottom>
          🎉 {t("bid.auctionEnded") || "Auction Ended!"}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("bid.winner")}: {winner.userId}
        </Typography>
        <Chip
          label={`${t("bid.finalPrice") || "Final Price"}: $${winner.amount}`}
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
              min: minimumBid,
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
            {t("bid.placeBid")}
          </Button>

          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              {t("bid.realTimeInfo")}
            </Typography>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
