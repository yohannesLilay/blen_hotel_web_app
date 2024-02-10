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
  TablePagination,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import {
  useGetBookRoomsQuery,
  useFreeBookRoomMutation,
  useDeleteBookRoomMutation,
} from "src/store/slices/reservations/bookRoomApiSlice";

const ActionButtons = ({ onDelete, onFree, roomStatus }) => {
  return (
    <div>
      {roomStatus && (
        <>
          <PermissionGuard permission="change_book_room">
            <Tooltip title="Free Booked Room">
              <IconButton color="primary" size="small" onClick={onFree}>
                <ExitToAppOutlined />
              </IconButton>
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard permission="delete_book_room">
            <Tooltip title="Delete Book Room">
              <IconButton color="error" size="small" onClick={onDelete}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
        </>
      )}
    </div>
  );
};

const BookRoomTableRow = ({ index, row, onDelete, onFree }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.room.name}</TableCell>
      <TableCell>{dayjs(row.book_date).format("DD-MM-YYYY HH:mm A")}</TableCell>
      <TableCell>{row.guest_in ? "In" : "Out"}</TableCell>
      <TableCell>{row.operator.name}</TableCell>
      <TableCell>{row.notes}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onFree={onFree}
          onDelete={onDelete}
          roomStatus={row.guest_in}
        />
      </TableCell>
    </TableRow>
  );
};

const BookRooms = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateQuery, setDateQuery] = useState(dayjs());

  const { data, isSuccess, refetch } = useGetBookRoomsQuery({
    page,
    limit,
    date: dateQuery.format("DD-MM-YYYY"),
  });
  const [bookRoomDeleteApi] = useDeleteBookRoomMutation();
  const [freeBookRoomApi] = useFreeBookRoomMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookRoomId, setDeleteBookRoomId] = useState(null);
  const [showFreeRoomModal, setShowFreeRoomModal] = useState(false);
  const [freeRoomId, setFreeRoomId] = useState(null);

  const [rows, setRows] = useState(data?.bookRooms || []);
  const totalBookRooms = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.bookRooms || []);
  }, [isSuccess, data]);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit });
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value;

    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit });
  };

  const handleDelete = (bookRoomId) => {
    setShowDeleteModal(true);
    setDeleteBookRoomId(bookRoomId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await bookRoomDeleteApi(deleteBookRoomId).unwrap();
      enqueueSnackbar("Booked Room deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((bookRoom) => bookRoom.id !== deleteBookRoomId)
      );

      setShowDeleteModal(false);
      setDeleteBookRoomId(null);
    } catch (err) {
      setDeleteBookRoomId(null);
      setShowDeleteModal(false);
    }
  };

  const handleFreeBookedRoom = (roomId) => {
    setShowFreeRoomModal(true);
    setFreeRoomId(roomId);
  };

  const handleFreeBookedRoomConfirmed = async () => {
    try {
      const response = await freeBookRoomApi({ id: freeRoomId }).unwrap();
      setRows((prevRows) =>
        prevRows.map((bookRoom) =>
          bookRoom.id === response.id ? response : bookRoom
        )
      );

      enqueueSnackbar(`Booked Room freed successfully.`, {
        variant: "success",
      });
      setFreeRoomId(null);
      setShowFreeRoomModal(false);
    } catch (err) {
      setFreeRoomId(null);
      setShowFreeRoomModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of BookRooms</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_book_room">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create?param=bed")}
                style={{ marginRight: "5px" }}
              >
                <AddOutlined /> Book Bed
              </Button>
            </PermissionGuard>
            <PermissionGuard permission="add_book_room">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create?param=hall")}
              >
                <AddOutlined /> Book Hall
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Filter by Date"
                variant="outlined"
                format="DD-MM-YYYY"
                maxDate={dayjs()}
                disableFuture
                value={dateQuery}
                id="book_date"
                onChange={(date) => {
                  setDateQuery(dayjs(date));
                }}
                sx={{
                  width: "100%",
                  "@media (min-width: 960px)": { width: "40%" },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Book Date</TableCell>
                    <TableCell>Guest</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Notes</TableCell>
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
                    <BookRoomTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onDelete={() => handleDelete(row.id)}
                      onFree={() => handleFreeBookedRoom(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalBookRooms}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </MainCard>
      </Grid>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this booked Room?"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showFreeRoomModal}
        onClose={() => setShowFreeRoomModal(false)}
        onConfirm={handleFreeBookedRoomConfirmed}
        dialogTitle={`Confirm Free Booked Room`}
        dialogContent={`Are you sure you want to free this booked room?`}
        dialogActionName="Confirm"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onFree: PropTypes.func.isRequired,
  roomStatus: PropTypes.bool.isRequired,
};

BookRoomTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onFree: PropTypes.func.isRequired,
};

export default BookRooms;
