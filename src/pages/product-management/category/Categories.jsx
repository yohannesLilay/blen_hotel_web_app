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
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "src/store/slices/product-management/categoryApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit Category">
        <IconButton color="primary" size="small" onClick={onEdit}>
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Category">
        <IconButton color="error" size="small" onClick={onDelete}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const CategoryTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {index + 1}
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Categories = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetCategoriesQuery();
  const [categoryDeleteApi] = useDeleteCategoryMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (categoryId) => {
    navigate(`${categoryId}/edit`);
  };

  const handleDelete = (categoryId) => {
    setShowDeleteModal(true);
    setDeleteCategoryId(categoryId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await categoryDeleteApi(deleteCategoryId).unwrap();
      enqueueSnackbar("Category deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((category) => category.id !== deleteCategoryId)
      );

      setShowDeleteModal(false);
      setDeleteCategoryId(null);
    } catch (err) {
      setDeleteCategoryId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Categories</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("create")}
            >
              <AddOutlined /> Add Category
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <CategoryTableRow
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
        dialogContent="Are you sure you want to delete this category?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

CategoryTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Categories;
