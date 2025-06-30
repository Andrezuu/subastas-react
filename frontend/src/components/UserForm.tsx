import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useUser } from "../hooks/useUser";
import type { IUser } from "../interfaces/IUser";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  editingItem?: IUser | null;
}

export const UserForm = ({ open, onClose, editingItem }: UserFormProps) => {
  const { formik } = useUser({
    editingItem,
    onSuccess: onClose,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{editingItem ? "Edit" : "Create"} User</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={formik.values.username || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
                disabled={!!editingItem}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                name="role"
                label="Role"
                value={formik.values.role || "user"}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                SelectProps={{ native: true }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
