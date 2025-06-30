import { useFormik } from "formik";
import * as Yup from "yup";
import type { IAuction } from "../interfaces/IAuction";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuctionStore } from "../store/useAuctionStore";
import { severities } from "../constants/severities";
import { useEffect } from "react";
interface useActionProps {
  editingItem?: IAuction;
  onSuccess: () => void;
}
export const useAction = ({ editingItem, onSuccess }: useActionProps) => {
  const { showMessage } = useSnackbar();
  const createAuction = useAuctionStore((state) => state.createAuction);
  const updateAuction = useAuctionStore((state) => state.updateAuction);
  const error = useAuctionStore((state) => state.error);
  const auctionSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    basePrice: Yup.number()
      .min(1, "Base price must be at least 1")
      .required("Base price is required"),
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
  });

  useEffect(() => {
    if (error) {
      showMessage(error, severities.ERROR);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: editingItem ? editingItem : ({} as IAuction),
    validationSchema: auctionSchema,
    enableReinitialize: true,
    onSubmit: async (values: IAuction) => {
      if (editingItem) {
        updateAuction({ id: editingItem.id, ...values });
        showMessage("Auction updated successfully", severities.SUCCESS);
      } else {
        createAuction(values);
        showMessage("Auction created successfully", severities.SUCCESS);
      }
      onSuccess();
      formik.resetForm();
    },
  });

  return {
    formik,
  };
};
