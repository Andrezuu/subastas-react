import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoutes from "../components/guards/ProtectedRoute";
import { Layout } from "../layout/Layout";
import ErrorComponent from "../components/ErrorComponent";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorComponent message="Falle unu" />}>
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
            <Route path="" />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
