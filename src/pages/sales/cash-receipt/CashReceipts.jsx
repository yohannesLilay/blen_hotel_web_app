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
import CashReceiptItemsModal from "./ItemsModal";
import {
  useGetCashReceiptsQuery,
  usePrintCashReceiptMutation,
  useDeleteCashReceiptMutation,
} from "src/store/slices/sales/cashReceiptApiSlice";

const ActionButtons = ({ onDetail, onDelete, onPrint, status, createdBy }) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Cash Receipt items">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      {(status === "Created" || status === "Printed") && (
        <PermissionGuard permission="print_cash_receipt">
          <Tooltip title="Print Cash Receipt">
            <IconButton color="primary" size="small" onClick={onPrint}>
              <PrintOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "Created" && createdBy === currentUser.userId && (
        <PermissionGuard permission="delete_cash_receipt">
          <Tooltip title="Delete Cash Receipt">
            <IconButton color="error" size="small" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const CashReceiptTableRow = ({ index, row, onDelete, onDetail, onPrint }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.cash_receipt_number}</TableCell>
      <TableCell>{dayjs(row.cash_receipt_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.created_by?.name}</TableCell>
      <TableCell>{row.waiter?.name}</TableCell>
      <TableCell>{row.captain_order_numbers.join(", ")}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
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

const CashReceipts = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetCashReceiptsQuery({
    page,
    limit,
    search: searchQuery,
  });
  const [cashReceiptDeleteApi] = useDeleteCashReceiptMutation();
  const [approveCashReceiptApi] = usePrintCashReceiptMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteCashReceiptId, setDeleteCashReceiptId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [changeStatusId, setPrintId] = useState(null);

  const [rows, setRows] = useState(data?.cashReceipts || []);
  const totalCashReceipts = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.cashReceipts || []);
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

  const handleDetail = (items) => {
    setShowDetailModal(true);
    setDetailItems(items);
  };

  const handlePrint = (cashReceiptId) => {
    setShowPrintModal(true);
    setPrintId(cashReceiptId);
  };

  const handlePrintConfirmed = async () => {
    try {
      const response = await approveCashReceiptApi({
        id: parseInt(changeStatusId),
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((cashReceipt) =>
          cashReceipt.id === response.id ? response : cashReceipt
        )
      );

      enqueueSnackbar(`Cash Receipt printed successfully.`, {
        variant: "success",
      });
      setPrintId(null);
      setShowPrintModal(false);
    } catch (err) {
      setPrintId(null);
      setShowPrintModal(false);
    }
  };

  const handleDelete = (cashReceiptId) => {
    setShowDeleteModal(true);
    setDeleteCashReceiptId(cashReceiptId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await cashReceiptDeleteApi(deleteCashReceiptId).unwrap();
      enqueueSnackbar("Cash Receipt deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((cashReceipt) => cashReceipt.id !== deleteCashReceiptId)
      );

      setShowDeleteModal(false);
      setDeleteCashReceiptId(null);
    } catch (err) {
      setDeleteCashReceiptId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Cash Receipts</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_cash_receipt">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Cash Receipt
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by cash receipt number"
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
                    <TableCell>Cash Receipt Number</TableCell>
                    <TableCell>Cash Receipt Date</TableCell>
                    <TableCell>Casher</TableCell>
                    <TableCell>Waiter</TableCell>
                    <TableCell>Captain Order</TableCell>
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
                    <CashReceiptTableRow
                      key={row.id}
                      index={index}
                      row={row}
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
              count={totalCashReceipts}
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
        dialogTitle={`Confirm Print Cash Receipt`}
        dialogContent={`Are you sure you want to approve this Cash Receipt?`}
        dialogActionName="Confirm"
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this Cash Receipt?"
      />

      <CashReceiptItemsModal
        isOpen={showDetailModal}
        onModalClose={() => setShowDetailModal(false)}
        cashReceiptItems={detailItems}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
};

CashReceiptTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export default CashReceipts;
