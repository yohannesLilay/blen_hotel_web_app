import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import {
  useGetPermissionsQuery,
  useDeletePermissionMutation,
} from "src/store/slices/security/permissionApiSlice";

const ActionButtons = ({ onDelete }) => {
  return (
    <div>
      <IconButton color="error" size="small" onClick={onDelete}>
        <DeleteOutlined />
      </IconButton>
    </div>
  );
};

const PermissionTableRow = ({ index, row, onDelete }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {index + 1}
      </TableCell>
      <TableCell>{row.code_name}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        <ActionButtons onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Permissions = () => {
  const { data, isSuccess } = useGetPermissionsQuery();
  const [permissionDeleteApi] = useDeletePermissionMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePermissionId, setDeletePermissionId] = useState(null);
  const [rows, setRows] = useState(data || []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleDelete = (permissionId) => {
    setShowDeleteModal(true);
    setDeletePermissionId(permissionId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await permissionDeleteApi(deletePermissionId).unwrap();
      enqueueSnackbar("Permission deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((permission) => permission.id !== deletePermissionId)
      );

      setPage(0);
      setShowDeleteModal(false);
      setDeletePermissionId(null);
    } catch (err) {
      setDeletePermissionId(null);
      setShowDeleteModal(false);
    }
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const displayedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Permissions</Typography>
          </Grid>
          <Grid item></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Code Name</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.map((row, index) => (
                    <PermissionTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      </Grid>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
        labelRowsPerPage="Rows per page"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this permission?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

PermissionTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Permissions;
