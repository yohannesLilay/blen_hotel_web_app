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
  useGetProductsQuery,
  useDeleteProductMutation,
} from "src/store/slices/configurations/productApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="Edit Product">
        <IconButton color="primary" size="small" onClick={onEdit}>
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Product">
        <IconButton color="error" size="small" onClick={onDelete}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const ProductTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {index + 1}
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.unit_of_measure}</TableCell>
      <TableCell>{row.category.name}</TableCell>
      <TableCell>{row.safety_stock_level}</TableCell>
      <TableCell>{row.notes}</TableCell>
      <TableCell>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetProductsQuery();
  const [productDeleteApi] = useDeleteProductMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (productId) => {
    navigate(`${productId}/edit`);
  };

  const handleDelete = (productId) => {
    setShowDeleteModal(true);
    setDeleteProductId(productId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await productDeleteApi(deleteProductId).unwrap();
      enqueueSnackbar("Product deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((product) => product.id !== deleteProductId)
      );

      setShowDeleteModal(false);
      setDeleteProductId(null);
    } catch (err) {
      setDeleteProductId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Products</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("create")}
            >
              <AddOutlined /> Add Product
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
                    <TableCell>UoM</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Safety Stock Level</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <ProductTableRow
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
        dialogContent="Are you sure you want to delete this product?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ProductTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Products;
