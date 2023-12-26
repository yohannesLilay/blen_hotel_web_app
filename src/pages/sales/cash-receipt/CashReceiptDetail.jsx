import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
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
  DeleteOutlined,
  PrintOutlined,
  ArrowBackOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import PrintCashReceiptModal from "./PrintCashReceiptModal";
import {
  useGetCashReceiptQuery,
  usePrintCashReceiptMutation,
  useDeleteCashReceiptMutation,
} from "src/store/slices/sales/cashReceiptApiSlice";

const ActionButtons = ({ onDelete, onPrint, status, createdBy }) => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="Back to Cash Receipts">
        <IconButton
          color="primary"
          size="large"
          onClick={() => navigate("../")}
        >
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
      <PermissionGuard permission="add_cash_receipt">
        <Tooltip title="Add New Cash Receipt">
          <IconButton
            color="primary"
            size="large"
            onClick={() => navigate("../create")}
          >
            <AddOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="print_cash_receipt">
        <Tooltip title="Print Cash Receipt">
          <IconButton color="primary" size="large" onClick={onPrint}>
            <PrintOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      {status === "PENDING" && createdBy === currentUser.userId && (
        <PermissionGuard permission="delete_cash_receipt">
          <Tooltip title="Delete Cash Receipt">
            <IconButton color="error" size="large" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const CashReceiptDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getCashReceipt } = useGetCashReceiptQuery(id);
  const [cashReceiptDeleteApi] = useDeleteCashReceiptMutation();
  const [approveCashReceiptApi] = usePrintCashReceiptMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const calculateTotalPrice = () => {
    return getCashReceipt.items.reduce(
      (total, row) => total + row.quantity * row.unit_price,
      0
    );
  };

  const handlePrintConfirmed = async () => {
    try {
      if (getCashReceipt?.status === "PENDING") {
        await approveCashReceiptApi({
          id: parseInt(getCashReceipt.id),
        }).unwrap();

        enqueueSnackbar(`Cash Receipt printed successfully.`, {
          variant: "success",
        });
      }

      setShowPrintModal(false);
    } catch (err) {
      setShowPrintModal(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await cashReceiptDeleteApi(id).unwrap();
      enqueueSnackbar("Cash Receipt deleted successfully.", {
        variant: "success",
        onEnter: () => {
          navigate(-1);
        },
      });

      setShowDeleteModal(false);
    } catch (err) {
      setShowDeleteModal(false);
    }
  };

  if (!getCashReceipt) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Cash Receipt Detail</Typography>
          </Grid>
          <Grid item>
            <ActionButtons
              onDelete={() => {
                setShowDeleteModal(true);
              }}
              onPrint={() => setShowPrintModal(true)}
              status={getCashReceipt.status}
              createdBy={getCashReceipt.created_by?.id}
            />
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Paper elevation={1} sx={{ p: 1, m: 1 }}>
            <Box sx={{ p: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Cash Receipt No:</span>{" "}
                    {getCashReceipt.cash_receipt_number}
                  </Box>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>
                      Cash Receipt Date:
                    </span>{" "}
                    {dayjs(getCashReceipt.cash_receipt_date).format(
                      "DD-MM-YYYY"
                    )}
                  </Box>
                  <Box component="div">
                    <span style={{ fontWeight: "bold" }}>Operator:</span>{" "}
                    {getCashReceipt.casher?.name}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Waiter:</span>{" "}
                    {getCashReceipt.waiter?.name}
                  </Box>
                  <Box component="div">
                    <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
                    {getCashReceipt.status}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Box sx={{ p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Menu Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCashReceipt.items.map((row, index) => (
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
                        {row.menu?.item}
                        {row.menu?.item_local_name &&
                          ` (${row.menu.item_local_name})`}
                      </TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.unit_price} BIRR</TableCell>
                      <TableCell>
                        {row.quantity * row.unit_price} BIRR
                      </TableCell>
                    </TableRow>
                  ))}
                  {getCashReceipt.items.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={3}></TableCell>
                      <TableCell align="right">
                        <strong>Total</strong>:
                      </TableCell>
                      <TableCell>{calculateTotalPrice()} BIRR</TableCell>
                    </TableRow>
                  )}
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
        dialogContent="Are you sure you want to delete this Cash Receipt?"
      />

      <PrintCashReceiptModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onPrint={handlePrintConfirmed}
        getPrintData={getCashReceipt || {}}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
};

export default CashReceiptDetail;
