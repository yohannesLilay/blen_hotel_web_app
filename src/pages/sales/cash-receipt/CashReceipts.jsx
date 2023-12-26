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
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import CashReceiptItemsModal from "./ItemsModal";
import AdvancedSearchModal from "./AdvancedSearchModal";
import PrintCashReceiptModal from "./PrintCashReceiptModal";
import {
  useGetCashReceiptsQuery,
  useGetCashReceiptTemplateQuery,
  usePrintCashReceiptMutation,
  useDeleteCashReceiptMutation,
} from "src/store/slices/sales/cashReceiptApiSlice";

const ActionButtons = ({
  onDetail,
  onItemDetail,
  onDelete,
  onPrint,
  status,
  casher,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Detail">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <ArrowDropDownOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="View Items">
        <IconButton color="primary" size="small" onClick={onItemDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      <PermissionGuard permission="print_cash_receipt">
        <Tooltip title="Print">
          <IconButton color="primary" size="small" onClick={onPrint}>
            <PrintOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      {status === "PENDING" && casher === currentUser.userId && (
        <PermissionGuard permission="delete_cash_receipt">
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const CashReceiptTableRow = ({
  index,
  row,
  onDelete,
  onDetail,
  onItemDetail,
  onPrint,
}) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.cash_receipt_number}</TableCell>
      <TableCell>{dayjs(row.cash_receipt_date).format("DD-MM-YYYY")}</TableCell>
      <TableCell>{row.casher?.name}</TableCell>
      <TableCell>{row.waiter?.name}</TableCell>
      <TableCell>
        {row.captain_orders
          .map((order) => order.captain_order_number)
          .join(", ")}
      </TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell align="right">
        <ActionButtons
          onDelete={onDelete}
          onDetail={onDetail}
          onItemDetail={onItemDetail}
          onPrint={onPrint}
          status={row.status}
          casher={row.casher?.id}
        />
      </TableCell>
    </TableRow>
  );
};

const CashReceipts = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState({});

  const { data, isSuccess, refetch } = useGetCashReceiptsQuery({
    page,
    limit,
    search,
  });
  const { data: getTemplate } = useGetCashReceiptTemplateQuery({
    filter: null,
  });
  const [cashReceiptDeleteApi] = useDeleteCashReceiptMutation();
  const [approveCashReceiptApi] = usePrintCashReceiptMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteCashReceiptId, setDeleteCashReceiptId] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [cashReceiptDetail, setCashReceiptDetail] = useState(null);
  const [advancedSearchModalOpen, setAdvancedSearchModalOpen] = useState(false);

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

  const objectToQueryString = async (obj) => {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");
  };

  const handleSearch = async () => {
    setPage(1);

    const updatedSearchQuery = {
      ...searchQuery,
      cash_receipt_number: searchQuery.cash_receipt_number || null,
    };

    const queryString = await objectToQueryString(updatedSearchQuery);
    setSearch(queryString);
  };

  const handleAdvancedSearch = async (advancedSearchQuery) => {
    setSearchQuery({ cash_receipt_number: null });
    const updatedSearchQuery = {
      cash_receipt_number: null,
      ...advancedSearchQuery,
    };

    setSearchQuery(updatedSearchQuery);
    setPage(1);

    const queryString = await objectToQueryString(updatedSearchQuery);
    setSearch(queryString);
  };

  const handleDetail = (items) => {
    setShowDetailModal(true);
    setDetailItems(items);
  };

  const handlePrint = (cashReceiptData) => {
    setShowPrintModal(true);
    setCashReceiptDetail(cashReceiptData);
  };

  const handlePrintConfirmed = async () => {
    try {
      if (cashReceiptDetail.status === "PENDING") {
        const response = await approveCashReceiptApi({
          id: parseInt(cashReceiptDetail.id),
        }).unwrap();
        setRows((prevRows) =>
          prevRows.map((cashReceipt) =>
            cashReceipt.id === response.id ? response : cashReceipt
          )
        );

        enqueueSnackbar(`Cash Receipt printed successfully.`, {
          variant: "success",
        });
      }

      setCashReceiptDetail(null);
      setShowPrintModal(false);
    } catch (err) {
      setCashReceiptDetail(null);
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
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} sx={{ p: 1, pt: 2 }}>
              <TextField
                label="Search by cash receipt number"
                variant="outlined"
                size="small"
                value={searchQuery.cash_receipt_number || ""}
                onChange={(e) =>
                  setSearchQuery({ cash_receipt_number: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                sx={{
                  width: "100%",
                  "@media (min-width: 600px)": { width: "60%" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ p: 1, pt: 2, textAlign: "right" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setAdvancedSearchModalOpen(true)}
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
                      onDetail={() => navigate(`${row.id}`)}
                      onItemDetail={() => handleDetail(row.items)}
                      onPrint={() => handlePrint(row)}
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

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this Cash Receipt?"
      />

      <CashReceiptItemsModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        cashReceiptItems={detailItems}
      />

      <AdvancedSearchModal
        isOpen={advancedSearchModalOpen}
        onClose={() => setAdvancedSearchModalOpen(false)}
        onSearch={(advancedSearchQuery) => {
          handleAdvancedSearch(advancedSearchQuery);
        }}
        getTemplate={getTemplate ? getTemplate : {}}
        searchQuery={searchQuery}
      />

      <PrintCashReceiptModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onPrint={handlePrintConfirmed}
        getPrintData={cashReceiptDetail ? cashReceiptDetail : {}}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onItemDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  casher: PropTypes.number.isRequired,
};

CashReceiptTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onItemDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export default CashReceipts;
