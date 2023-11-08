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
  useCheckOrderMutation,
  useApproveOrderMutation,
  useDeleteOrderMutation,
} from "src/store/slices/purchases/orderApiSlice";

const ActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  onCheck,
  onApprove,
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
            <IconButton color="primary" size="small" onClick={onCheck}>
              <CheckCircleOutline />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Checked" && (
        <PermissionGuard permission="approve_purchase_order">
          <Tooltip title="Approve Purchase Order">
            <IconButton color="primary" size="small" onClick={onApprove}>
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
  onCheck,
  onApprove,
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
          onCheck={onCheck}
          onApprove={onApprove}
          status={row.status}
          requestedBy={row.requested_by?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const Orders = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetOrdersQuery({
    page,
    limit,
    search: searchQuery,
  });
  const [orderDeleteApi] = useDeleteOrderMutation();
  const [orderCheckApi] = useCheckOrderMutation();
  const [orderApproveApi] = useApproveOrderMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [showCheckActionModal, setShowCheckActionModal] = useState(false);
  const [showApproveActionModal, setShowApproveActionModal] = useState(false);
  const [changeStatusId, setChangeStatusId] = useState(null);

  const [rows, setRows] = useState(data?.orders || []);
  const totalOrders = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.orders || []);
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

  const handleEdit = (orderId) => {
    navigate(`${orderId}/edit`);
  };

  const handleDetail = (orderId, orderStatus, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailOrder({ orderId: orderId, orderStatus: orderStatus });
  };

  const handleCheckAction = (orderId) => {
    setShowCheckActionModal(true);
    setChangeStatusId(orderId);
  };

  const handleApproveAction = (orderId) => {
    setShowApproveActionModal(true);
    setChangeStatusId(orderId);
  };

  const handleCheckActionConfirmed = async () => {
    try {
      const response = await orderCheckApi({
        id: parseInt(changeStatusId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((order) => (order.id === response.id ? response : order))
      );

      enqueueSnackbar(`Purchase order checked successfully.`, {
        variant: "success",
      });
      setChangeStatusId(null);
      setShowCheckActionModal(false);
    } catch (err) {
      setChangeStatusId(null);
      setShowCheckActionModal(false);
    }
  };

  const handleApproveActionConfirmed = async () => {
    try {
      const response = await orderApproveApi({
        id: parseInt(changeStatusId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((order) => (order.id === response.id ? response : order))
      );

      enqueueSnackbar(`Purchase order approved successfully.`, {
        variant: "success",
      });
      setChangeStatusId(null);
      setShowApproveActionModal(false);
    } catch (err) {
      setChangeStatusId(null);
      setShowApproveActionModal(false);
    }
  };

  const handleDelete = (orderId) => {
    setShowDeleteModal(true);
    setDeleteOrderId(orderId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await orderDeleteApi(deleteOrderId).unwrap();
      enqueueSnackbar("Purchase order deleted successfully.", {
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
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by order number"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
                      onCheck={() => handleCheckAction(row.id)}
                      onApprove={() => handleApproveAction(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalOrders}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </MainCard>
      </Grid>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showCheckActionModal}
        onClose={() => setShowCheckActionModal(false)}
        onConfirm={handleCheckActionConfirmed}
        dialogTitle="Confirm Check Order"
        dialogContent={`Are you sure you want to check this order?`}
        dialogActionName="Confirm"
      />

      <ConfirmationModal
        open={showApproveActionModal}
        onClose={() => setShowApproveActionModal(false)}
        onConfirm={handleApproveActionConfirmed}
        dialogTitle="Confirm Approve Order"
        dialogContent={`Are you sure you want to approve this order?`}
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
  onCheck: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  requestedBy: PropTypes.number.isRequired,
};

OrderTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default Orders;
