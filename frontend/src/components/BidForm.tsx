import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useBidForm } from "../hooks/useBidForm";

export const BidForm = () => {
  const { t } = useTranslation();

  const { formik, bidError, minimumBid, currentBid, currentBidUser } =
    useBidForm();

  // if (hasEnded) {
  //   return (
  //     <Paper elevation={2} sx={{ p: 3, mt: 2, textAlign: "center" }}>
  //       <Typography variant="h5" color="success.main" gutterBottom>
  //         🎉 {t("bid.auctionEnded")}
  //       </Typography>
  //       <Typography variant="h6" gutterBottom>
  //         {t("bid.winner")}: {currentBidUser?.username || currentBidUser.id}
  //       </Typography>
  //       <Chip
  //         label={`${t("bid.finalPrice")}: $${currentBid.amount}`}
  //         color="success"
  //       />
  //     </Paper>
  //   );
  // }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("bid.placeBid")}
      </Typography>

      {/* ✅ Mostrar bid actual si existe */}
      {currentBid && (
        <Box mb={2} p={2} bgcolor="info.light" borderRadius={1}>
          <Typography variant="subtitle2">{t("bid.currentHighest")}</Typography>
          <Typography variant="h6" color="primary">
            ${currentBid.amount}
          </Typography>
          {currentBidUser && (
            <Typography variant="body2" color="text.secondary">
              {t("bid.by")} {currentBidUser.username}
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
            {formik.isSubmitting ? t("bid.placing") : t("bid.placeBid")}
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
