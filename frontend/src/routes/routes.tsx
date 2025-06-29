import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoutes from "../components/guards/ProtectedRoute";
import { Layout } from "../layout/Layout";
import ErrorComponent from "../components/ErrorComponent";
import { useTranslation } from "react-i18next";
import Home from "../pages/Home";

export const AppRoutes = () => {
  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorComponent message={t("error.routes")} />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoutes>
                <Layout />
              </ProtectedRoutes>
            }
          >
            <Route path="" element={<Home />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
