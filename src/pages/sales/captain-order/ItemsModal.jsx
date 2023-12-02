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
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import AddItemModal from "./AddItemModal";
import {
  useDeleteCaptainOrderItemMutation,
  useCreateCaptainOrderItemMutation,
  useGetCaptainOrderTemplateQuery,
} from "src/store/slices/sales/captainOrderApiSlice";

const CaptainOrderItemsModal = ({
  isOpen,
  onModalClose,
  captainOrderItems,
  captainOrderId,
  captainOrderStatus,
}) => {
  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [captainOrderDeleteApi] = useDeleteCaptainOrderItemMutation();
  const [captainOrderCreateApi] = useCreateCaptainOrderItemMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCaptainOrderItemId, setDeleteCaptainOrderItemId] =
    useState(null);
  const [rows, setRows] = useState(captainOrderItems || []);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  useEffect(() => {
    setRows(captainOrderItems || []);
  }, [captainOrderItems]);

  const handleAddItemClick = () => {
    setIsAddItemModalOpen(true);
  };

  const handleAddItem = async (itemData) => {
    try {
      const item = await captainOrderCreateApi({
        ...itemData,
        id: captainOrderId,
      }).unwrap();
      enqueueSnackbar("Captain Order item added successfully.", {
        variant: "success",
      });

      setRows([...rows, item]);
      setIsAddItemModalOpen(false);
    } catch (err) {
      setIsAddItemModalOpen(false);
    }
  };

  const handleDelete = (captainOrder_id) => {
    setShowDeleteModal(true);
    setDeleteCaptainOrderItemId(captainOrder_id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await captainOrderDeleteApi({
        id: captainOrderId,
        item_id: deleteCaptainOrderItemId,
      }).unwrap();
      enqueueSnackbar("Captain Order item deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((item) => item.id !== deleteCaptainOrderItemId)
      );

      setShowDeleteModal(false);
      setDeleteCaptainOrderItemId(null);
    } catch (err) {
      setDeleteCaptainOrderItemId(null);
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
            maxWidth: 1200,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">
                  List of Captain Order Items
                </Typography>
              </Grid>
              <Grid item>
                {captainOrderStatus === "PENDING" && (
                  <PermissionGuard permission="add_captain_order">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddItemClick}
                    >
                      <AddOutlined /> Add Item
                    </Button>
                  </PermissionGuard>
                )}
              </Grid>
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Menu Item</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="right">
                          <PermissionGuard permission="add_captain_order">
                            {captainOrderStatus === "PENDING" && "Action"}
                          </PermissionGuard>
                        </TableCell>
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
                          <TableCell>
                            {row.menu?.item}{" "}
                            {row.menu?.item_local_name &&
                              ` (${row.menu.item_local_name})`}
                          </TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell align="right">
                            {captainOrderStatus === "PENDING" && (
                              <PermissionGuard permission="add_captain_order">
                                <Tooltip title="Delete Captain Order Item">
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(row.id)}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </Tooltip>
                              </PermissionGuard>
                            )}
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
            dialogContent="Are you sure you want to delete this captain order item?"
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

CaptainOrderItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  captainOrderItems: PropTypes.array.isRequired,
  captainOrderId: PropTypes.number,
  captainOrderStatus: PropTypes.string,
};

export default CaptainOrderItemsModal;
