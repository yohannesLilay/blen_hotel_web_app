import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
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
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutline,
  FactCheckOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import OrderItemsModal from "./ItemsModal";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "src/store/slices/purchases/orderApiSlice";

const ActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  onStatusAction,
  status,
  requestedBy,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Order items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      {status === "Requested" && (
        <PermissionGuard permission="check_purchase_order">
          <Tooltip title="Check Purchase Order">
            <IconButton color="primary" size="small" onClick={onStatusAction}>
              <CheckCircleOutline />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Checked" && (
        <PermissionGuard permission="check_purchase_order">
          <Tooltip title="Approve Purchase Order">
            <IconButton color="primary" size="small" onClick={onStatusAction}>
              <FactCheckOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <PermissionGuard permission="change_purchase_order">
          <Tooltip title="Edit Order">
            <IconButton color="primary" size="small" onClick={onEdit}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <PermissionGuard permission="delete_purchase_order">
          <Tooltip title="Delete Order">
            <IconButton color="error" size="small" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const OrderTableRow = ({
  index,
  row,
  onDelete,
  onEdit,
  onDetail,
  onStatusAction,
}) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.order_number}</TableCell>
      <TableCell>{dayjs(row.order_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.requested_by?.name}</TableCell>
      <TableCell>{row.checked_by?.name}</TableCell>
      <TableCell>{row.approved_by?.name}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onDetail={onDetail}
          onStatusAction={onStatusAction}
          status={row.status}
          requestedBy={row.requested_by?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const Orders = () => {
  const navigate = useNavigate();

  const { data, isSuccess } = useGetOrdersQuery();
  const [orderDeleteApi] = useDeleteOrderMutation();
  const [updateOrderStatusApi] = useUpdateOrderStatusMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [changeStatusId, setChangeStatusId] = useState(null);
  const [changeOrderStatus, setChangeOrderStatus] = useState("");
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (orderId) => {
    navigate(`${orderId}/edit`);
  };

  const handleDetail = (orderId, orderStatus, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailOrder({ orderId: orderId, orderStatus: orderStatus });
  };

  const handleStatusAction = (orderId, status) => {
    setShowChangeStatusModal(true);
    setChangeStatusId(orderId);
    setChangeOrderStatus(status);
  };

  const handleChangeStatusConfirmed = async () => {
    try {
      let command = "";
      if (changeOrderStatus == "Requested") command = "Checked";
      if (changeOrderStatus == "Checked") command = "Approved";
      const response = await updateOrderStatusApi({
        id: parseInt(changeStatusId),
        command,
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((order) => (order.id === response.id ? response : order))
      );

      enqueueSnackbar(`Order ${command} successfully.`, {
        variant: "success",
      });
      setChangeStatusId(null);
      setShowChangeStatusModal(false);
      setChangeOrderStatus("");
    } catch (err) {
      setChangeStatusId(null);
      setShowChangeStatusModal(false);
      setChangeOrderStatus("");
    }
  };

  const handleDelete = (orderId) => {
    setShowDeleteModal(true);
    setDeleteOrderId(orderId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await orderDeleteApi(deleteOrderId).unwrap();
      enqueueSnackbar("Purchase Order deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((order) => order.id !== deleteOrderId)
      );

      setShowDeleteModal(false);
      setDeleteOrderId(null);
    } catch (err) {
      setDeleteOrderId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Purchase Orders</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_purchase_order">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Purchase Order
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Checked By</TableCell>
                    <TableCell>Approved By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <OrderTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                      onDetail={() =>
                        handleDetail(row.id, row.status, row.items)
                      }
                      onStatusAction={() =>
                        handleStatusAction(row.id, row.status)
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      </Grid>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showChangeStatusModal}
        onClose={() => setShowChangeStatusModal(false)}
        onConfirm={handleChangeStatusConfirmed}
        dialogTitle={`Confirm ${
          changeOrderStatus == "Requested" ? "Check" : "Approve"
        } Order`}
        dialogContent={`Are you sure you want to ${
          changeOrderStatus == "Requested" ? "check" : "approve"
        } this order?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this purchase order?"
      />

      <OrderItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        orderItems={detailItems}
        orderId={detailOrder?.orderId || null}
        orderStatus={detailOrder?.orderStatus || null}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onStatusAction: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  requestedBy: PropTypes.number.isRequired,
};

OrderTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onStatusAction: PropTypes.func.isRequired,
};

export default Orders;
