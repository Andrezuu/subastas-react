import { createContext, useContext, useState, type ReactNode } from "react";
import { Alert, Snackbar, type AlertColor } from "@mui/material";
import { SnackbarSeverity } from "../constants/SnackbarSeverity";

interface ISnackbarContext {
  showMessage: (message: string, severity?: string) => void;
}
const SnackbarContext = createContext<ISnackbarContext>({} as ISnackbarContext);

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(SnackbarSeverity.INFO);
  const [open, setOpen] = useState(false);

  const showMessage = (message: string, severity?: string) => {
    setMessage(message);
    setSeverity(severity || SnackbarSeverity.INFO);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity as AlertColor}>{message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
