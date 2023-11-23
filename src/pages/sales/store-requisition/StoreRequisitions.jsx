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
  FolderCopyOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import StoreRequisitionItemsModal from "./ItemsModal";
import {
  useGetStoreRequisitionsQuery,
  useApproveStoreRequisitionMutation,
  useReleaseStoreRequisitionMutation,
  useDeleteStoreRequisitionMutation,
} from "src/store/slices/sales/storeRequisitionApiSlice";

const ActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  onApprove,
  onRelease,
  status,
  requestedBy,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Store Requisition items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      {status === "Requested" && (
        <PermissionGuard permission="approve_store_requisition">
          <Tooltip title="Approve Store Requisition">
            <IconButton color="primary" size="small" onClick={onApprove}>
              <FactCheckOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Approved" && (
        <PermissionGuard permission="release_store_requisition">
          <Tooltip title="Release Store Requisition">
            <IconButton color="primary" size="small" onClick={onRelease}>
              <FolderCopyOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <PermissionGuard permission="change_store_requisition">
          <Tooltip title="Edit Store Requisition">
            <IconButton color="primary" size="small" onClick={onEdit}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Requested" && requestedBy === currentUser.userId && (
        <PermissionGuard permission="delete_store_requisition">
          <Tooltip title="Delete Store Requisition">
            <IconButton color="error" size="small" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const StoreRequisitionTableRow = ({
  index,
  row,
  onDelete,
  onEdit,
  onDetail,
  onApprove,
  onRelease,
}) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.store_requisition_number}</TableCell>
      <TableCell>
        {dayjs(row.store_requisition_date).format("DD-MM-YYYY")}
      </TableCell>
      <TableCell>{row.requested_by?.name}</TableCell>
      <TableCell>{row.approved_by?.name}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onDetail={onDetail}
          onApprove={onApprove}
          onRelease={onRelease}
          status={row.status}
          requestedBy={row.requested_by?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const StoreRequisitions = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetStoreRequisitionsQuery({
    page,
    limit,
    search: searchQuery,
  });
  const [storeRequisitionDeleteApi] = useDeleteStoreRequisitionMutation();
  const [approveStoreRequisitionApi] = useApproveStoreRequisitionMutation();
  const [releaseStoreRequisitionApi] = useReleaseStoreRequisitionMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteStoreRequisitionId, setDeleteStoreRequisitionId] =
    useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailStoreRequisition, setDetailStoreRequisition] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedChangeId, setSelectedChangeId] = useState(null);

  const [rows, setRows] = useState(data?.storeRequisitions || []);
  const totalStoreRequisitions = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.storeRequisitions || []);
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

  const handleEdit = (storeRequisitionId) => {
    navigate(`${storeRequisitionId}/edit`);
  };

  const handleDetail = (storeRequisition) => {
    setShowDetailModal(true);
    setDetailItems(storeRequisition.items);
    setDetailStoreRequisition(storeRequisition);
  };

  const handleApprove = (storeRequisitionId) => {
    setShowApproveModal(true);
    setSelectedChangeId(storeRequisitionId);
  };

  const handleApproveConfirmed = async () => {
    try {
      const response = await approveStoreRequisitionApi({
        id: parseInt(selectedChangeId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((storeRequisition) =>
          storeRequisition.id === response.id ? response : storeRequisition
        )
      );

      enqueueSnackbar(`Store Requisition approved successfully.`, {
        variant: "success",
      });
      setSelectedChangeId(null);
      setShowApproveModal(false);
    } catch (err) {
      setSelectedChangeId(null);
      setShowApproveModal(false);
    }
  };

  const handleRelease = (storeRequisitionId) => {
    setShowReleaseModal(true);
    setSelectedChangeId(storeRequisitionId);
  };

  const handleReleaseConfirmed = async () => {
    try {
      const response = await releaseStoreRequisitionApi({
        id: parseInt(selectedChangeId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((storeRequisition) =>
          storeRequisition.id === response.id ? response : storeRequisition
        )
      );

      enqueueSnackbar(`Store Requisition released successfully.`, {
        variant: "success",
      });
      setSelectedChangeId(null);
      setShowReleaseModal(false);
    } catch (err) {
      setSelectedChangeId(null);
      setShowReleaseModal(false);
    }
  };

  const handleDelete = (storeRequisitionId) => {
    setShowDeleteModal(true);
    setDeleteStoreRequisitionId(storeRequisitionId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await storeRequisitionDeleteApi(deleteStoreRequisitionId).unwrap();
      enqueueSnackbar("Store Requisition deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter(
          (storeRequisition) => storeRequisition.id !== deleteStoreRequisitionId
        )
      );

      setShowDeleteModal(false);
      setDeleteStoreRequisitionId(null);
    } catch (err) {
      setDeleteStoreRequisitionId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Store Requisitions</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_store_requisition">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Store Requisition
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by store requisition number"
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
                    <TableCell>Store Requisition Number</TableCell>
                    <TableCell>Store Requisition Date</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Approved By</TableCell>
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
                    <StoreRequisitionTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                      onDetail={() => handleDetail(row)}
                      onApprove={() => handleApprove(row.id)}
                      onRelease={() => handleRelease(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalStoreRequisitions}
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
        dialogTitle={`Confirm Approve Store Requisition`}
        dialogContent={`Are you sure you want to approve this Store Requisition?`}
        dialogActionName="Confirm"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        onConfirm={handleReleaseConfirmed}
        dialogTitle={`Confirm Release Store Requisition`}
        dialogContent={`Are you sure you want to release this Store Requisition?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this Store Requisition?"
      />

      <StoreRequisitionItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        storeRequisitionItems={detailItems}
        storeRequisitionId={detailStoreRequisition?.storeRequisitionId}
        storeRequisitionStatus={
          detailStoreRequisition?.storeRequisitionStatus || null
        }
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  requestedBy: PropTypes.number.isRequired,
};

StoreRequisitionTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
};

export default StoreRequisitions;
