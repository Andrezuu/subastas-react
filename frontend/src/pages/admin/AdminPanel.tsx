import { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Gavel,
  People,
  Add,
  Edit,
  Delete,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { AuctionForm } from "../../components/AuctionForm";
import { UserForm } from "../../components/UserForm";
import { useAdminPanel } from "../../hooks/useAdminPanel";

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

  // Auction Columns
  const auctionColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Auction Name",
      width: 250,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "basePrice",
      headerName: "Base Price",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          ${params.value}
        </Typography>
      ),
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditAuction(params.row)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteAuction(params.row.id)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  // User Columns
  const userColumns: GridColDef[] = [
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value === "admin" ? "error.main" : "text.secondary"}
          fontWeight={params.value === "admin" ? "bold" : "normal"}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditUser(params.row)} size="small">
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteUser(params.row.id)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

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
              <DataGrid
                rows={auctions}
                columns={auctionColumns}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                disableRowSelectionOnClick
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
              <DataGrid
                rows={users}
                columns={userColumns}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                disableRowSelectionOnClick
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
    </Box>
  );
};
