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
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import OrderItemsModal from "./ItemsModal";
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from "src/store/slices/purchases/orderApiSlice";

const ActionButtons = ({ onDetail, onEdit, onDelete }) => {
  return (
    <div>
      <Tooltip title="View Order items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <MoreVertOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit Order">
        <IconButton color="primary" size="small" onClick={onEdit}>
          <EditOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Order">
        <IconButton color="error" size="small" onClick={onDelete}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const OrderTableRow = ({ index, row, onDelete, onEdit, onDetail }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {index + 1}
      </TableCell>
      <TableCell>{row.order_number}</TableCell>
      <TableCell>{dayjs(row.order_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.requested_by?.name}</TableCell>
      <TableCell>{row.checked_by?.name}</TableCell>
      <TableCell>{row.approved_by?.name}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onDetail={onDetail}
        />
      </TableCell>
    </TableRow>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetOrdersQuery();
  const [orderDeleteApi] = useDeleteOrderMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (orderId) => {
    navigate(`${orderId}/edit`);
  };

  const handleDetail = (orderId, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailOrder(orderId);
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("create")}
            >
              <AddOutlined /> Add Purchase Order
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
                    <TableCell>Order Number</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Checked By</TableCell>
                    <TableCell>Approved By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
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
                      onDetail={() => handleDetail(row.id, row.items)}
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
        dialogContent="Are you sure you want to delete this purchase order?"
      />

      <OrderItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        orderItems={detailItems}
        orderId={detailOrder}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
};

OrderTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
};

export default Orders;
