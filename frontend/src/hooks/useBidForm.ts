import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useAppWebSocket } from "./useWebSocket";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useAuctionStore } from "../store/useAuctionStore";
import { useBidStore } from "../store/useBidStore";
import { severities } from "../constants/severities";
import { createBid } from "../services/bidService";
import { useUserStore } from "../store/useUserStore";

interface BidFormValues {
  amount: string;
}

// ✅ useBidForm.ts corregido
export const useBidForm = () => {
  const getUserById = useUserStore((state) => state.getUserById);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { placeBid, bidError } = useAppWebSocket();
  const { showMessage } = useSnackbar();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);

  const auction = getAuctionById(auctionId || "");
  const currentBid = getCurrentBid(auctionId || "");

  const currentBidUser = currentBid
    ? getUserById(currentBid.userId)
    : undefined;

  const minimumBid = currentBid
    ? currentBid.amount + 1
    : auction?.basePrice || 0;

  const bidSchema = Yup.object({
    amount: Yup.number()
      .required(t("bid.amountRequired"))
      .min(minimumBid, `${t("bid.minimumBid")} ${minimumBid}`)
      .positive(t("bid.positiveAmount")),
  });

  const formik = useFormik({
    initialValues: { amount: "" },
    validationSchema: bidSchema,
    enableReinitialize: true,
    onSubmit: async (values: BidFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: BidFormValues) => {
    if (!auctionId || !user?.id) {
      showMessage(t("bid.loginRequired"), severities.ERROR);
      return;
    }

    if (!auction) {
      showMessage(t("bid.auctionNotFound"), severities.ERROR);
      return;
    }

    try {
      const bidAmount = parseFloat(values.amount);

      if (bidAmount < minimumBid) {
        showMessage(`${t("bid.minimumBid")} ${minimumBid}`, severities.ERROR);
        return;
      }

      // WebSocket actualiza automáticamente el BidStore
      placeBid(auctionId, bidAmount, user.id);

      await createBid({
        auctionId,
        amount: bidAmount,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      showMessage(
        t("bid.success") || "Bid placed successfully!",
        severities.SUCCESS
      );
      formik.resetForm();
    } catch (error) {
      console.error("Error placing bid:", error);
      showMessage(t("bid.error") || "Error placing bid", severities.ERROR);
    }
  };

  return {
    formik,
    bidError,
    minimumBid,
    auction,
    currentBid,
    currentBidUser, // ✅ Ahora será correcto
  };
};
