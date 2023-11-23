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
  useGetStaffsQuery,
  useToggleStaffMutation,
  useDeleteStaffMutation,
} from "src/store/slices/configurations/staffApiSlice";

const ActionButtons = ({ onEdit, onDelete, onToggleStatus, status }) => {
  return (
    <div>
      <PermissionGuard permission="change_staff">
        <Tooltip title={status ? "Deactivate Staff" : "Activate Staff"}>
          <IconButton color="primary" size="small" onClick={onToggleStatus}>
            {status ? <ToggleOffOutlined /> : <ToggleOnOutlined />}
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="change_staff">
        <Tooltip title="Edit Staff">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_staff">
        <Tooltip title="Delete Staff">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const StaffTableRow = ({ index, row, onDelete, onEdit, onToggleStatus }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.phone_number}</TableCell>
      <TableCell>{row.staff_type}</TableCell>
      <TableCell>{row.status ? "Active" : "Inactive"}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          status={row.status}
        />
      </TableCell>
    </TableRow>
  );
};

const Staffs = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetStaffsQuery();

  const [staffDeleteApi] = useDeleteStaffMutation();
  const [staffToggleApi] = useToggleStaffMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [toggleStaffId, setToggleStaffId] = useState(null);
  const [toggleStaffStatus, setToggleStaffStatus] = useState(false);

  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (staffId) => {
    navigate(`${staffId}/edit`);
  };

  const handleDelete = (staffId) => {
    setShowDeleteModal(true);
    setDeleteStaffId(staffId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await staffDeleteApi(deleteStaffId).unwrap();
      enqueueSnackbar("Staff deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((staff) => staff.id !== deleteStaffId)
      );

      setShowDeleteModal(false);
      setDeleteStaffId(null);
    } catch (err) {
      setDeleteStaffId(null);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = (staffId, status) => {
    setShowToggleModal(true);
    setToggleStaffId(staffId);
    setToggleStaffStatus(status);
  };

  const handleToggleStatusConfirmed = async () => {
    try {
      const response = await staffToggleApi({ id: toggleStaffId }).unwrap();
      setRows((prevRows) =>
        prevRows.map((staff) => (staff.id === response.id ? response : staff))
      );

      enqueueSnackbar(
        `Staff ${
          toggleStaffStatus ? "Deactivated" : "Activated"
        } successfully.`,
        {
          variant: "success",
        }
      );
      setToggleStaffId(null);
      setShowToggleModal(false);
      setToggleStaffStatus(false);
    } catch (err) {
      setToggleStaffId(null);
      setShowToggleModal(false);
      setToggleStaffStatus(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Staffs</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_staff">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Staff
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
                    <TableCell>Name</TableCell>
                    <TableCell>Phone No</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">
                          No data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row, index) => (
                    <StaffTableRow
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
        dialogContent="Are you sure you want to delete this staff?"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onConfirm={handleToggleStatusConfirmed}
        dialogTitle={`Confirm Staff ${
          toggleStaffStatus ? "Deactivation" : "Activation"
        }`}
        dialogContent={`Are you sure you want to ${
          toggleStaffStatus ? "deactivate" : "activate"
        } this staff?`}
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

StaffTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

export default Staffs;
