import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SnackbarSeverity } from "../../constants/SnackbarSeverity";
import { useTranslation } from "react-i18next";
import { createUserAPI } from "../../services/userService";

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
    .required("El nombre de usuario es requerido"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Rol inválido")
    .required("El rol es requerido"),
  avatar: Yup.string().url("Debe ser una URL válida").optional(),
});

interface RegisterFormValues {
  username: string;
  role: string;
  avatar?: string;
}

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: "",
      role: "",
      avatar: "https://picsum.photos/200",
    },
    validationSchema: registerSchema,
    onSubmit: async (values: RegisterFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await createUserAPI({
        id: new Date().getTime().toString(),
        ...values,
      });
      if (!res) {
        showMessage(t("auth.registerError"), SnackbarSeverity.ERROR);
        return;
      }

      login(res);
      showMessage(t("auth.registerSuccess"), SnackbarSeverity.SUCCESS);
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
          <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "secondary.main" }} />
          <Typography variant="h4" component="h1">
            {t("auth.registerTitle")}
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
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t("auth.role")}</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              label={t("auth.role")}
            >
              <MenuItem value="user">{t("auth.roleUser")}</MenuItem>
              <MenuItem value="admin">{t("auth.roleAdmin")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="avatar"
            label={t("auth.avatar")}
            placeholder="https://example.com/avatar.jpg"
            value={formik.values.avatar}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.avatar && Boolean(formik.errors.avatar)}
            helperText={formik.touched.avatar && formik.errors.avatar}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ mt: 1, mb: 2 }}
          >
            {t("auth.registerButton")}
          </Button>

          <Button fullWidth variant="text" onClick={() => navigate("/login")}>
            {t("auth.hasAccount")}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
