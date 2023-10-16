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
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
} from "src/store/slices/configurations/companyApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit Company">
        <IconButton color="primary" size="small" onClick={onEdit}>
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Company">
        <IconButton color="error" size="small" onClick={onDelete}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const CompanyTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell align="right">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Companies = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetCompaniesQuery();
  const [companyDeleteApi] = useDeleteCompanyMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (companyId) => {
    navigate(`${companyId}/edit`);
  };

  const handleDelete = (companyId) => {
    setShowDeleteModal(true);
    setDeleteCompanyId(companyId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await companyDeleteApi(deleteCompanyId).unwrap();
      enqueueSnackbar("Company deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((company) => company.id !== deleteCompanyId)
      );

      setShowDeleteModal(false);
      setDeleteCompanyId(null);
    } catch (err) {
      setDeleteCompanyId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Companies</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("create")}
            >
              <AddOutlined /> Add Company
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <CompanyTableRow
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
        dialogContent="Are you sure you want to delete this company?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

CompanyTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Companies;
