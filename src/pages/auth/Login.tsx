import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SnackbarSeverity } from "../../constants/SnackbarSeverity";
import { useTranslation } from "react-i18next";
import { loginAPI } from "../../services/authService";

const loginSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
    .required("El nombre de usuario es requerido"),
});

interface LoginFormValues {
  username: string;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: loginSchema,
    onSubmit: async (values: LoginFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const res = await loginAPI(values.username);
      if (!res) {
        showMessage(t("auth.notFound"), SnackbarSeverity.ERROR);
        return;
      }
      login(res);

      showMessage(t("auth.success"), SnackbarSeverity.SUCCESS);
      navigate("/app", { replace: true });
    } catch (error) {
      showMessage(t("auth.errorGeneric"), SnackbarSeverity.ERROR);
    }
    formik.resetForm();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "primary.main" }} />
          <Typography variant="h4" component="h1">
            {t("auth.loginTitle")}
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label={t("auth.username")}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {t("auth.loginButton")}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/register")}
          >
            {t("auth.noAccount")}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
