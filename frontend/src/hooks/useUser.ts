import { useFormik } from "formik";
import * as Yup from "yup";
import type { IUser } from "../interfaces/IUser";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useUserStore } from "../store/useUserStore";
import { severities } from "../constants/severities";
import { useEffect } from "react";

interface UseUserProps {
  editingItem?: IUser | null;
  onSuccess?: () => void;
}

export const useUser = ({ editingItem, onSuccess }: UseUserProps = {}) => {
  const { showMessage } = useSnackbar();
  const createUser = useUserStore((state) => state.createUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const error = useUserStore((state) => state.error);

  const userSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    role: Yup.string()
      .oneOf(["user", "admin"], "Invalid role")
      .required("Role is required"),
  });

  useEffect(() => {
    if (error) {
      showMessage(error, severities.ERROR);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: editingItem || ({} as IUser),
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: (values: IUser) => {
      if (editingItem) {
        updateUser({ id: editingItem.id, ...values });
        showMessage("User updated successfully", severities.SUCCESS);
      } else {
        createUser(values);
        showMessage("User created successfully", severities.SUCCESS);
      }

      onSuccess?.();
      formik.resetForm();
    },
  });

  return {
    formik,
    isEditing: !!editingItem,
  };
};
