import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import {
  useGetUsersQuery,
  useToggleUserMutation,
  useDeleteUserMutation,
} from "src/store/slices/security/userApiSlice";

const ActionButtons = ({ onEdit, onDelete, onToggleStatus, status }) => {
  return (
    <div>
      <PermissionGuard permission="change_user">
        <Tooltip title={status ? "Deactivate User" : "Activate User"}>
          <IconButton color="primary" size="small" onClick={onToggleStatus}>
            {status ? <ToggleOffOutlined /> : <ToggleOnOutlined />}
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="change_user">
        <Tooltip title="Edit User">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_user">
        <Tooltip title="Delete User">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const UserTableRow = ({ index, row, onDelete, onEdit, onToggleStatus }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.phone_number}</TableCell>
      <TableCell>{row.gender}</TableCell>
      <TableCell>{row.roles.map((role) => role.name).join(", ")}</TableCell>
      <TableCell>{row.status ? "Active" : "Inactive"}</TableCell>
      <TableCell align="right">
        {row.id !== 1 && (
          <ActionButtons
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            status={row.status}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

const Users = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetUsersQuery();
  const [userDeleteApi] = useDeleteUserMutation();
  const [userToggleApi] = useToggleUserMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [toggleUserId, setToggleUserId] = useState(null);
  const [toggleUserStatus, setToggleUserStatus] = useState(false);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (userId) => {
    navigate(`${userId}/edit`);
  };

  const handleDelete = (userId) => {
    setShowDeleteModal(true);
    setDeleteUserId(userId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await userDeleteApi(deleteUserId).unwrap();
      enqueueSnackbar("User deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((user) => user.id !== deleteUserId)
      );

      setShowDeleteModal(false);
      setDeleteUserId(null);
    } catch (err) {
      setDeleteUserId(null);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = (userId, status) => {
    setShowToggleModal(true);
    setToggleUserId(userId);
    setToggleUserStatus(status);
  };

  const handleToggleStatusConfirmed = async () => {
    try {
      const response = await userToggleApi({ id: toggleUserId }).unwrap();
      setRows((prevRows) =>
        prevRows.map((user) => (user.id === response.id ? response : user))
      );

      enqueueSnackbar(
        `User ${toggleUserStatus ? "Deactivated" : "Activated"} successfully.`,
        {
          variant: "success",
        }
      );
      setToggleUserId(null);
      setShowToggleModal(false);
      setToggleUserStatus(false);
    } catch (err) {
      setToggleUserId(null);
      setShowToggleModal(false);
      setToggleUserStatus(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Users</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_user">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add User
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone No</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                      onToggleStatus={() =>
                        handleStatusToggle(row.id, row.status)
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      </Grid>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this user?"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onConfirm={handleToggleStatusConfirmed}
        dialogTitle={`Confirm User ${
          toggleUserStatus ? "Deactivation" : "Activation"
        }`}
        dialogContent={`Are you sure you want to ${
          toggleUserStatus ? "deactivate" : "activate"
        } this user?`}
        dialogActionName="Confirm"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  status: PropTypes.bool.isRequired,
};

UserTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

export default Users;
