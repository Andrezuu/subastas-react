import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n/i18n.ts";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
