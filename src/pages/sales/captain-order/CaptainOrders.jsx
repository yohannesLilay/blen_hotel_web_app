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
  VisibilityOutlined,
  PrintOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import CaptainOrderItemsModal from "./ItemsModal";
import AdvancedSearchModal from "./AdvancedSearchModal";
import {
  useGetCaptainOrdersQuery,
  useGetCaptainOrderTemplateQuery,
  usePrintCaptainOrderMutation,
  useDeleteCaptainOrderMutation,
} from "src/store/slices/sales/captainOrderApiSlice";

const ActionButtons = ({
  onDetail,
  onEdit,
  onDelete,
  onPrint,
  status,
  createdBy,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Captain Order items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      {(status === "Created" || status === "Printed") && (
        <PermissionGuard permission="print_captain_order">
          <Tooltip title="Print Captain Order">
            <IconButton color="primary" size="small" onClick={onPrint}>
              <PrintOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Created" && createdBy === currentUser.userId && (
        <PermissionGuard permission="change_captain_order">
          <Tooltip title="Edit Captain Order">
            <IconButton color="primary" size="small" onClick={onEdit}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Created" && createdBy === currentUser.userId && (
        <PermissionGuard permission="delete_captain_order">
          <Tooltip title="Delete Captain Order">
            <IconButton color="error" size="small" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const CaptainOrderTableRow = ({
  index,
  row,
  onDelete,
  onEdit,
  onDetail,
  onPrint,
}) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.captain_order_number}</TableCell>
      <TableCell>
        {dayjs(row.captain_order_date).format("DD-MM-YYYY")}
      </TableCell>
      <TableCell>{row.created_by?.name}</TableCell>
      <TableCell>{row.waiter?.name}</TableCell>
      <TableCell>{row.facility_type?.name}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onDetail={onDetail}
          onPrint={onPrint}
          status={row.status}
          createdBy={row.created_by?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const CaptainOrders = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetCaptainOrdersQuery({
    page,
    limit,
    search: searchQuery,
  });
  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [captainOrderDeleteApi] = useDeleteCaptainOrderMutation();
  const [approveCaptainOrderApi] = usePrintCaptainOrderMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteCaptainOrderId, setDeleteCaptainOrderId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailCaptainOrder, setDetailCaptainOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [changeStatusId, setPrintId] = useState(null);
  const [advancedSearchModalOpen, setAdvancedSearchModalOpen] = useState(false);

  const [rows, setRows] = useState(data?.captainOrders || []);
  const totalCaptainOrders = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.captainOrders || []);
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

  const handleAdvancedSearch = () => {
    setAdvancedSearchModalOpen(true);
  };

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      setPage(1);

      refetch({ page, limit, search: searchQuery });
    }
  };

  const handleEdit = (captainOrderId) => {
    navigate(`${captainOrderId}/edit`);
  };

  const handleDetail = (captainOrderId, captainOrderStatus, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailCaptainOrder({
      captainOrderId: captainOrderId,
      captainOrderStatus: captainOrderStatus,
    });
  };

  const handlePrint = (captainOrderId) => {
    setShowPrintModal(true);
    setPrintId(captainOrderId);
  };

  const handlePrintConfirmed = async () => {
    try {
      const response = await approveCaptainOrderApi({
        id: parseInt(changeStatusId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((captainOrder) =>
          captainOrder.id === response.id ? response : captainOrder
        )
      );

      enqueueSnackbar(`Captain Order printed successfully.`, {
        variant: "success",
      });
      setPrintId(null);
      setShowPrintModal(false);
    } catch (err) {
      setPrintId(null);
      setShowPrintModal(false);
    }
  };

  const handleDelete = (captainOrderId) => {
    setShowDeleteModal(true);
    setDeleteCaptainOrderId(captainOrderId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await captainOrderDeleteApi(deleteCaptainOrderId).unwrap();
      enqueueSnackbar("Captain Order deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter(
          (captainOrder) => captainOrder.id !== deleteCaptainOrderId
        )
      );

      setShowDeleteModal(false);
      setDeleteCaptainOrderId(null);
    } catch (err) {
      setDeleteCaptainOrderId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Captain Orders</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_captain_order">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Captain Order
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
              <TextField
                label="Search by captain order number"
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
                  "@media (min-width: 960px)": { width: "60%" },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ p: 1, pt: 2, textAlign: "right" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAdvancedSearch} // Open advanced search modal
              >
                Advanced Search
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Captain Order Number</TableCell>
                    <TableCell>Captain Order Date</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Waiter</TableCell>
                    <TableCell>Facility</TableCell>
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
                    <CaptainOrderTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                      onDetail={() =>
                        handleDetail(row.id, row.status, row.items)
                      }
                      onPrint={() => handlePrint(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalCaptainOrders}
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
        open={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onConfirm={handlePrintConfirmed}
        dialogTitle={`Confirm Print Captain Order`}
        dialogContent={`Are you sure you want to approve this Captain Order?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this Captain Order?"
      />

      <CaptainOrderItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        captainOrderItems={detailItems}
        captainOrderId={detailCaptainOrder?.captainOrderId}
        captainOrderStatus={detailCaptainOrder?.captainOrderStatus || null}
      />

      <AdvancedSearchModal
        isOpen={advancedSearchModalOpen}
        onClose={() => setAdvancedSearchModalOpen(false)}
        onSearch={(searchQuery) => {
          setSearchQuery(searchQuery);
          handleSearch();
        }}
        getTemplate={getTemplate ? getTemplate : {}}
        searchQuery={searchQuery}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
};

CaptainOrderTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export default CaptainOrders;
