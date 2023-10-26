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
  MoreVertOutlined,
  FactCheckOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import ReceivableItemsModal from "./ItemsModal";
import {
  useGetReceivablesQuery,
  useUpdateReceivableStatusMutation,
  useDeleteReceivableMutation,
} from "src/store/slices/purchases/receivableApiSlice";

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
      <Tooltip title="View Receivable items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <MoreVertOutlined />
        </IconButton>
      </Tooltip>
      {status !== "Approved" && (
        <Tooltip title="Approve Receivable">
          <IconButton color="primary" size="small" onClick={onStatusAction}>
            <FactCheckOutlined />
          </IconButton>
        </Tooltip>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <Tooltip title="Edit Receivable">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <Tooltip title="Delete Receivable">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const ReceivableTableRow = ({
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
      <TableCell>{row.receivable_number}</TableCell>
      <TableCell>{row.order_number}</TableCell>
      <TableCell>{dayjs(row.receivable_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.supplier?.name}</TableCell>
      <TableCell>{row.requested_by?.name}</TableCell>
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

const Receivables = () => {
  const navigate = useNavigate();

  const { data, isSuccess } = useGetReceivablesQuery();
  const [receivableDeleteApi] = useDeleteReceivableMutation();
  const [updateReceivableStatusApi] = useUpdateReceivableStatusMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteReceivableId, setDeleteReceivableId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailReceivable, setDetailReceivable] = useState(null);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [changeStatusId, setChangeStatusId] = useState(null);
  const [rows, setRows] = useState(data || []);

  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (receivableId) => {
    navigate(`${receivableId}/edit`);
  };

  const handleDetail = (receivableId, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailReceivable(receivableId);
  };

  const handleStatusAction = (receivableId) => {
    setShowChangeStatusModal(true);
    setChangeStatusId(receivableId);
  };

  const handleChangeStatusConfirmed = async () => {
    try {
      const response = await updateReceivableStatusApi({
        id: parseInt(changeStatusId),
        command: "Approved",
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((receivable) =>
          receivable.id === response.id ? response : receivable
        )
      );

      enqueueSnackbar(`Receivable approved successfully.`, {
        variant: "success",
      });
      setChangeStatusId(null);
      setShowChangeStatusModal(false);
    } catch (err) {
      setChangeStatusId(null);
      setShowChangeStatusModal(false);
    }
  };

  const handleDelete = (receivableId) => {
    setShowDeleteModal(true);
    setDeleteReceivableId(receivableId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await receivableDeleteApi(deleteReceivableId).unwrap();
      enqueueSnackbar("Purchase Receivable deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((receivable) => receivable.id !== deleteReceivableId)
      );

      setShowDeleteModal(false);
      setDeleteReceivableId(null);
    } catch (err) {
      setDeleteReceivableId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Purchase Receivables</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("create")}
            >
              <AddOutlined /> Add Purchase Receivable
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
                    <TableCell>Receivable Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Receivable Date</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Approved By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <ReceivableTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                      onDetail={() => handleDetail(row.id, row.items)}
                      onStatusAction={() => handleStatusAction(row.id)}
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
        dialogTitle={`Confirm Approve Receivable`}
        dialogContent={`Are you sure you want to approve this receivable?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this purchase receivable?"
      />

      <ReceivableItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        receivableItems={detailItems}
        receivableId={detailReceivable}
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

ReceivableTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onStatusAction: PropTypes.func.isRequired,
};

export default Receivables;
