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
  useGetRoomsQuery,
  useToggleRoomMutation,
  useDeleteRoomMutation,
} from "src/store/slices/configurations/roomApiSlice";

const ActionButtons = ({ onEdit, onDelete, onToggleStatus, status }) => {
  return (
    <div>
      <PermissionGuard permission="change_room">
        <Tooltip title={status ? "Deactivate Room" : "Activate Room"}>
          <IconButton color="primary" size="small" onClick={onToggleStatus}>
            {status ? <ToggleOffOutlined /> : <ToggleOnOutlined />}
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="change_room">
        <Tooltip title="Edit Room">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_room">
        <Tooltip title="Delete Room">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const RoomTableRow = ({ index, row, onDelete, onEdit, onToggleStatus }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.price}</TableCell>
      <TableCell>{row.room_type}</TableCell>
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

const Rooms = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetRoomsQuery();

  const [roomDeleteApi] = useDeleteRoomMutation();
  const [roomToggleApi] = useToggleRoomMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [toggleRoomId, setToggleRoomId] = useState(null);
  const [toggleRoomStatus, setToggleRoomStatus] = useState(false);

  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (roomId) => {
    navigate(`${roomId}/edit`);
  };

  const handleDelete = (roomId) => {
    setShowDeleteModal(true);
    setDeleteRoomId(roomId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await roomDeleteApi(deleteRoomId).unwrap();
      enqueueSnackbar("Room deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((room) => room.id !== deleteRoomId)
      );

      setShowDeleteModal(false);
      setDeleteRoomId(null);
    } catch (err) {
      setDeleteRoomId(null);
      setShowDeleteModal(false);
    }
  };

  const handleStatusToggle = (roomId, status) => {
    setShowToggleModal(true);
    setToggleRoomId(roomId);
    setToggleRoomStatus(status);
  };

  const handleToggleStatusConfirmed = async () => {
    try {
      const response = await roomToggleApi({ id: toggleRoomId }).unwrap();
      setRows((prevRows) =>
        prevRows.map((room) => (room.id === response.id ? response : room))
      );

      enqueueSnackbar(
        `Room ${toggleRoomStatus ? "Deactivated" : "Activated"} successfully.`,
        {
          variant: "success",
        }
      );
      setToggleRoomId(null);
      setShowToggleModal(false);
      setToggleRoomStatus(false);
    } catch (err) {
      setToggleRoomId(null);
      setShowToggleModal(false);
      setToggleRoomStatus(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Rooms</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_room">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Room
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
                    <TableCell>Price</TableCell>
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
                    <RoomTableRow
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
        dialogContent="Are you sure you want to delete this room?"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onConfirm={handleToggleStatusConfirmed}
        dialogTitle={`Confirm Room ${
          toggleRoomStatus ? "Deactivation" : "Activation"
        }`}
        dialogContent={`Are you sure you want to ${
          toggleRoomStatus ? "deactivate" : "activate"
        } this room?`}
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

RoomTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

export default Rooms;
