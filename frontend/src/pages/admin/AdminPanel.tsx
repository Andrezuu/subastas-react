import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Gavel, People, Add, AdminPanelSettings } from "@mui/icons-material";
import { AuctionForm } from "../../components/AuctionForm";
import { UserForm } from "../../components/UserForm";
import { useAdminPanel } from "../../hooks/useAdminPanel";
import { UserTable } from "../../components/UserTable";
import { AuctionTable } from "../../components/AuctionTable";
import { useState } from "react";

const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const AdminPanel = () => {
  const {
    handleDeleteAuction,
    handleEditAuction,
    handleDeleteUser,
    handleEditUser,
    statistics,
    tabValue,
    handleTabChange,
    handleCreateAuction,
    auctions,
    handleCreateUser,
    users,
    openAuctionDialog,
    setOpenAuctionDialog,
    openUserDialog,
    setOpenUserDialog,
    editingAuction,
    editingUser,
  } = useAdminPanel();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "",
    itemName: "",
    onConfirm: () => {},
  });

  const confirmDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setDeleteDialog({
      open: true,
      type: "user",
      itemName: user?.username || "",
      onConfirm: () => {
        handleDeleteUser(userId);
        setDeleteDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const confirmDeleteAuction = (auctionId: string) => {
    const auction = auctions.find((a) => a.id === auctionId);
    setDeleteDialog({
      open: true,
      type: "auction",
      itemName: auction?.name || "",
      onConfirm: () => {
        handleDeleteAuction(auctionId);
        setDeleteDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Admin Panel
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "primary.main" }}>
                <Gavel />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {statistics.totalAuctions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Auctions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "success.main" }}>
                <People />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {statistics.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "info.main" }}>
                <AdminPanelSettings />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {statistics.activeAuctions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Auctions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Manage Auctions" />
          <Tab label="Manage Users" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Auctions Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateAuction}
              >
                Create Auction
              </Button>
            </Box>

            <Box sx={{ height: 400, width: "100%" }}>
              <AuctionTable
                handleDeleteAuction={confirmDeleteAuction}
                handleEditAuction={handleEditAuction}
              />
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Users Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateUser}
              >
                Create User
              </Button>
            </Box>

            <Box sx={{ height: 400, width: "100%" }}>
              <UserTable
                handleDeleteUser={confirmDeleteUser}
                handleEditUser={handleEditUser}
              />
            </Box>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Dialogs */}
      <AuctionForm
        open={openAuctionDialog}
        onClose={() => setOpenAuctionDialog(false)}
        editingItem={editingAuction}
      />

      <UserForm
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        editingItem={editingUser}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.type} "
            {deleteDialog.itemName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog((prev) => ({ ...prev, open: false }))
            }
          >
            Cancel
          </Button>
          <Button
            onClick={deleteDialog.onConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
