import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
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
import { DeleteOutlined, AddOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import AddItemModal from "./AddItemModal";
import {
  useDeleteOrderItemMutation,
  useCreateOrderItemMutation,
  useGetOrderTemplateQuery,
} from "src/store/slices/purchases/orderApiSlice";

const OrderItemsModal = ({ isOpen, onModalClose, orderItems, orderId }) => {
  const { data: getTemplate } = useGetOrderTemplateQuery();
  const [orderDeleteApi] = useDeleteOrderItemMutation();
  const [orderCreateApi] = useCreateOrderItemMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderItemId, setDeleteOrderItemId] = useState(null);
  const [rows, setRows] = useState(orderItems || []);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  useEffect(() => {
    setRows(orderItems || []);
  }, [orderItems]);

  const handleAddItemClick = () => {
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = async (itemData) => {
    try {
      const item = await orderCreateApi({ ...itemData, id: orderId }).unwrap();
      enqueueSnackbar("Purchase Order Item added successfully.", {
        variant: "success",
      });

      setRows([...rows, item]);
      setIsAddItemModalOpen(false);
    } catch (err) {
      setIsAddItemModalOpen(false);
    }
  };

  const handleDelete = (order_id) => {
    setShowDeleteModal(true);
    setDeleteOrderItemId(order_id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await orderDeleteApi({
        id: orderId,
        item_id: deleteOrderItemId,
      }).unwrap();
      enqueueSnackbar("Purchase Order Item deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((item) => item.id !== deleteOrderItemId)
      );

      setShowDeleteModal(false);
      setDeleteOrderItemId(null);
    } catch (err) {
      setDeleteOrderItemId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Modal open={isOpen} onClose={onModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 800,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">
                  List of Purchase Order Items
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItemClick}
                >
                  <AddOutlined /> Add Item
                </Button>
              </Grid>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box
                sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>UoM</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Remark</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell>{row.product?.name}</TableCell>
                          <TableCell>{row.product?.unit_of_measure}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{row.unit_price}</TableCell>
                          <TableCell>{row.total_price}</TableCell>
                          <TableCell>{row.remark}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete Order Item">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(row.id)}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
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
            dialogContent="Are you sure you want to delete this purchase order item?"
          />

          <AddItemModal
            isOpen={isAddItemModalOpen}
            onClose={() => {
              setIsAddItemModalOpen(false);
            }}
            onAdd={handleAddItem}
            currentItem={null}
            getTemplate={getTemplate || {}}
          />
        </Box>
      </Modal>
    </>
  );
};

OrderItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  orderItems: PropTypes.array.isRequired,
  orderId: PropTypes.number,
};

export default OrderItemsModal;
