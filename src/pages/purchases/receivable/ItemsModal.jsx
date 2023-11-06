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
  useDeleteReceivableItemMutation,
  useCreateReceivableItemMutation,
  useGetReceivableTemplateQuery,
} from "src/store/slices/purchases/receivableApiSlice";

const ReceivableItemsModal = ({
  isOpen,
  onModalClose,
  receivableItems,
  receivableId,
}) => {
  const { data: getTemplate } = useGetReceivableTemplateQuery();
  const [receivableDeleteApi] = useDeleteReceivableItemMutation();
  const [receivableCreateApi] = useCreateReceivableItemMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReceivableItemId, setDeleteReceivableItemId] = useState(null);
  const [rows, setRows] = useState(receivableItems || []);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  useEffect(() => {
    setRows(receivableItems || []);
  }, [receivableItems]);

  const handleAddItemClick = () => {
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = async (itemData) => {
    try {
      const item = await receivableCreateApi({
        ...itemData,
        id: receivableId,
      }).unwrap();
      enqueueSnackbar("Purchase Receivable Item added successfully.", {
        variant: "success",
      });

      setRows([...rows, item]);
      setIsAddItemModalOpen(false);
    } catch (err) {
      setIsAddItemModalOpen(false);
    }
  };

  const handleDelete = (receivable_id) => {
    setShowDeleteModal(true);
    setDeleteReceivableItemId(receivable_id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await receivableDeleteApi({
        id: receivableId,
        item_id: deleteReceivableItemId,
      }).unwrap();
      enqueueSnackbar("Purchase Receivable Item deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((item) => item.id !== deleteReceivableItemId)
      );

      setShowDeleteModal(false);
      setDeleteReceivableItemId(null);
    } catch (err) {
      setDeleteReceivableItemId(null);
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
                  List of Purchase Receivable Items
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
              <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>UoM</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Remark</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell>{row.product?.name}</TableCell>
                          <TableCell>{row.product?.unit_of_measure}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{row.unit_price}</TableCell>
                          <TableCell>{row.total_price}</TableCell>
                          <TableCell>{row.remark}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete Receivable Item">
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
            dialogContent="Are you sure you want to delete this purchase receivable item?"
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

ReceivableItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  receivableItems: PropTypes.array.isRequired,
  receivableId: PropTypes.number,
};

export default ReceivableItemsModal;
