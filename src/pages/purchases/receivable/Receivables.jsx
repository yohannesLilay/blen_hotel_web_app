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
  FactCheckOutlined,
  VisibilityOutlined,
  ReviewsOutlined,
  ThumbDownAltOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import ReceivableItemsModal from "./ItemsModal";
import RejectModal from "../RejectModal";
import RejectDetailModal from "../RejectDetailModal";
import {
  useGetReceivablesQuery,
  useApproveReceivableMutation,
  useRejectReceivableMutation,
  useDeleteReceivableMutation,
} from "src/store/slices/purchases/receivableApiSlice";

const ActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  onRejectDetail,
  onApprove,
  onReject,
  status,
  preparedBy,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View GRV items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      {status === "Rejected" && (
        <Tooltip title="GRV Reject Detail">
          <IconButton color="primary" size="small" onClick={onRejectDetail}>
            <ReviewsOutlined />
          </IconButton>
        </Tooltip>
      )}
      {status === "Requested" && (
        <PermissionGuard permission="approve_purchase_receivable">
          <Tooltip title="Approve GRV">
            <IconButton color="primary" size="small" onClick={onApprove}>
              <FactCheckOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {(status === "Requested" || status === "Checked") && (
        <PermissionGuard permission="reject_purchase_receivable">
          <Tooltip title="Reject GRV">
            <IconButton color="primary" size="small" onClick={onReject}>
              <ThumbDownAltOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {(status === "Requested" || status === "Rejected") &&
        preparedBy === currentUser.userId && (
          <PermissionGuard permission="change_purchase_receivable">
            <Tooltip title="Edit GRV">
              <IconButton color="primary" size="small" onClick={onEdit}>
                <EditOutlined />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
        )}
      {(status === "Requested" || status === "Rejected") &&
        preparedBy === currentUser.userId && (
          <PermissionGuard permission="delete_purchase_receivable">
            <Tooltip title="Delete GRV">
              <IconButton color="error" size="small" onClick={onDelete}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
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
  onRejectDetail,
  onApprove,
  onReject,
}) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.receivable_number}</TableCell>
      <TableCell>{row.order?.order_number}</TableCell>
      <TableCell>{dayjs(row.receivable_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.supplier?.name}</TableCell>
      <TableCell>{row.prepared_by?.name}</TableCell>
      <TableCell>{row.received_by?.name}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onRejectDetail={onRejectDetail}
          onDetail={onDetail}
          onApprove={onApprove}
          onReject={onReject}
          status={row.status}
          preparedBy={row.prepared_by?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const Receivables = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetReceivablesQuery({
    page,
    limit,
    search: searchQuery,
  });
  const [receivableDeleteApi] = useDeleteReceivableMutation();
  const [approveReceivableApi] = useApproveReceivableMutation();
  const [receivableRejectApi] = useRejectReceivableMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectionDetailModal, setShowRejectionDetailModal] =
    useState(false);
  const [deleteReceivableId, setDeleteReceivableId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailReceivable, setDetailReceivable] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectActionModal, setShowRejectActionModal] = useState(false);
  const [changeStatusId, setApproveId] = useState(null);

  const [rows, setRows] = useState(data?.receivables || []);
  const totalReceivables = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.receivables || []);
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
      setSearch(searchQuery);

      refetch({ page, limit, search });
    } else {
      setSearch("");
    }
  };

  const handleApproveConfirmed = async () => {
    try {
      const response = await approveReceivableApi({
        id: parseInt(changeStatusId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((receivable) =>
          receivable.id === response.id ? response : receivable
        )
      );

      enqueueSnackbar(`GRV approved successfully.`, {
        variant: "success",
      });
      setApproveId(null);
      setShowApproveModal(false);
    } catch (err) {
      setApproveId(null);
      setShowApproveModal(false);
    }
  };

  const handleRejectAction = async (rejectionData) => {
    try {
      const data = {
        id: parseInt(changeStatusId),
        rejection_reason: rejectionData.rejection_reason,
      };
      const response = await receivableRejectApi(data).unwrap();
      setRows((prevRows) =>
        prevRows.map((receivable) =>
          receivable.id === response.id ? response : receivable
        )
      );

      enqueueSnackbar(`Purchase receivable(GRV) rejected successfully.`, {
        variant: "success",
      });
      setApproveId(null);
      setShowRejectActionModal(false);
    } catch (err) {
      setApproveId(null);
      setShowRejectActionModal(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await receivableDeleteApi(deleteReceivableId).unwrap();
      enqueueSnackbar("GRV deleted successfully.", {
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
            <Typography variant="h5">List of GRVs</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_purchase_receivable">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add GRV
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by grv number"
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
                    <TableCell>GRV Number</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>GRV Date</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Prepared By</TableCell>
                    <TableCell>Received By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">
                          No data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row, index) => (
                    <ReceivableTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => {
                        navigate(`${row.id}/edit`);
                      }}
                      onDelete={() => {
                        setShowDeleteModal(true);
                        setDeleteReceivableId(row.id);
                      }}
                      onDetail={() => {
                        setShowDetailModal(true);
                        setDetailItems(row.items);
                        setDetailReceivable({
                          receivableId: row.id,
                          receivableStatus: row.status,
                        });
                      }}
                      onRejectDetail={() => {
                        setShowRejectionDetailModal(true);
                        setDetailReceivable(row);
                      }}
                      onApprove={() => {
                        setShowApproveModal(true);
                        setApproveId(row.id);
                      }}
                      onReject={() => {
                        setShowRejectActionModal(true);
                        setApproveId(row.id);
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalReceivables}
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
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirmed}
        dialogTitle={`Confirm Approve GRV`}
        dialogContent={`Are you sure you want to approve this GRV?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this GRV?"
      />

      <ReceivableItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        receivableItems={detailItems}
        receivableId={detailReceivable?.receivableId}
        receivableStatus={detailReceivable?.receivableStatus || null}
      />

      <RejectModal
        isOpen={showRejectActionModal}
        onClose={() => {
          setShowRejectActionModal(false);
          setApproveId(null);
        }}
        dialogTitle="Reject Purchase Receivable(GRV)"
        dialogAction="Reject GRV"
        onAdd={handleRejectAction}
      />

      <RejectDetailModal
        isOpen={showRejectionDetailModal}
        onClose={() => {
          setShowRejectionDetailModal(false);
          setDetailReceivable(null);
        }}
        dialogTitle="Purchase Receivable(GRV) Rejection Detail"
        rejectDetail={detailReceivable || {}}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onRejectDetail: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  preparedBy: PropTypes.number.isRequired,
};

ReceivableTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onRejectDetail: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default Receivables;
