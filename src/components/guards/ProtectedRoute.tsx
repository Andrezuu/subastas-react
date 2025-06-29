import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, type ReactNode } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "react-i18next";
import { SnackbarSeverity } from "../../constants/SnackbarSeverity";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();
  const logoutMessage = useRef(false);

  useEffect(() => {
    if (!isAuth && logoutMessage.current) {
      showMessage(t("snackbar.noSession"), SnackbarSeverity.WARNING);
      logoutMessage.current = true;
    }
  }, [isAuth]);

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
