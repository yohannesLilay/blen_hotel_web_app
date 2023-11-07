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
  TextField,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportExportOutlined,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ImportDialog from "src/components/modals/ImportModal";
import {
  useGetProductsQuery,
  useImportProductMutation,
  useDeleteProductMutation,
} from "src/store/slices/product-management/productApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <PermissionGuard permission="change_product">
        <Tooltip title="Edit Product">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_product">
        <Tooltip title="Delete Product">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const ProductTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.unit_of_measure}</TableCell>
      <TableCell>{row.category.name}</TableCell>
      <TableCell>{row.stock_quantity}</TableCell>
      <TableCell>{row.safety_stock_level}</TableCell>
      <TableCell>{row.notes}</TableCell>
      <TableCell align="right">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetProductsQuery({
    page,
    limit,
    search: searchQuery,
  });
  const [productDeleteApi] = useDeleteProductMutation();
  const [importProduct] = useImportProductMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [rows, setRows] = useState(data?.products || []);
  const totalProducts = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.products || []);
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

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      setPage(1);

      refetch({ page, limit, search: searchQuery });
    }
  };

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

  const handleImport = async (importData) => {
    try {
      await importProduct(importData).unwrap();
      setPage(1);
      refetch();

      enqueueSnackbar("Product Item imported successfully.", {
        variant: "success",
      });

      setShowImportModal(false);
    } catch (err) {
      setShowImportModal(false);
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
            <PermissionGuard permission="import_product">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowImportModal(true)}
                style={{ marginRight: "10px" }}
              >
                <ImportExportOutlined /> Import Product
              </Button>
            </PermissionGuard>
            <PermissionGuard permission="add_product">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Product
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by name"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              sx={{
                width: "100%",
                "@media (min-width: 960px)": { width: "40%" },
              }}
            />
          </Grid>

          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>UoM</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Qty in Stoke</TableCell>
                    <TableCell>Safety Stock Level</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Action</TableCell>
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalProducts}
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
        dialogContent="Are you sure you want to delete this product?"
      />

      <ImportDialog
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
        }}
        onImport={handleImport}
        dialogContent="Import Categories"
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
