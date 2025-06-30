import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useAppWebSocket } from "./useWebSocket";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useAuctionStore } from "../store/useAuctionStore";
import { severities } from "../constants/severities";

interface BidFormValues {
  amount: string;
}

export const useBidForm = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { placeBid, bidError, currentBids } = useAppWebSocket();
  const { showMessage } = useSnackbar();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);

  const auction = getAuctionById(auctionId || "");
  const currentBid = currentBids[auctionId || ""];

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

      placeBid(auctionId, bidAmount, user.id);
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
  };
};
