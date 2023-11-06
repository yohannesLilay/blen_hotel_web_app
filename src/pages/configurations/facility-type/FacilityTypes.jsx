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
import { AddOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import {
  useGetFacilityTypesQuery,
  useDeleteFacilityTypeMutation,
} from "src/store/slices/configurations/facilityTypeApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <PermissionGuard permission="change_facility_type">
        <Tooltip title="Edit Facility Type">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_facility_type">
        <Tooltip title="Delete Facility Type">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const FacilityTypeTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>
        {row.responsible_roles.map((role) => role.name).join(", ")}
      </TableCell>
      <TableCell align="right">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const FacilityTypes = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetFacilityTypesQuery();
  const [facilityTypeDeleteApi] = useDeleteFacilityTypeMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFacilityTypeId, setDeleteFacilityTypeId] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (facilityTypeId) => {
    navigate(`${facilityTypeId}/edit`);
  };

  const handleDelete = (facilityTypeId) => {
    setShowDeleteModal(true);
    setDeleteFacilityTypeId(facilityTypeId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await facilityTypeDeleteApi(deleteFacilityTypeId).unwrap();
      enqueueSnackbar("Facility Type deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter(
          (facilityType) => facilityType.id !== deleteFacilityTypeId
        )
      );

      setShowDeleteModal(false);
      setDeleteFacilityTypeId(null);
    } catch (err) {
      setDeleteFacilityTypeId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Facility Types</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_facility_type">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Facility Type
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
                    <TableCell>Description</TableCell>
                    <TableCell>Responsible Roles</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <FacilityTypeTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
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
        dialogContent="Are you sure you want to delete this facility type?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

FacilityTypeTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FacilityTypes;
