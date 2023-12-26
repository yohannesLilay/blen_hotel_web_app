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
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import CaptainOrderItemsModal from "./ItemsModal";
import AdvancedSearchModal from "./AdvancedSearchModal";
import PrintCaptainOrderModal from "./PrintCaptainOrderModal";
import {
  useGetCaptainOrdersQuery,
  useGetCaptainOrderTemplateQuery,
  usePrintCaptainOrderMutation,
  useDeleteCaptainOrderMutation,
} from "src/store/slices/sales/captainOrderApiSlice";

const ActionButtons = ({
  onDetail,
  onItemDetail,
  onEdit,
  onDelete,
  onPrint,
  status,
  createdBy,
}) => {
  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="View Detail">
        <IconButton color="primary" size="small" onClick={onDetail}>
          <ArrowDropDownOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="View items">
        <IconButton color="primary" size="small" onClick={onItemDetail}>
          <VisibilityOutlined />
        </IconButton>
      </Tooltip>
      <PermissionGuard permission="print_captain_order">
        <Tooltip title="Print">
          <IconButton color="primary" size="small" onClick={onPrint}>
            <PrintOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      {status === "PENDING" && createdBy === currentUser.userId && (
        <PermissionGuard permission="change_captain_order">
          <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={onEdit}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "PENDING" && createdBy === currentUser.userId && (
        <PermissionGuard permission="delete_captain_order">
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

const CaptainOrderTableRow = ({
  index,
  row,
  onDelete,
  onEdit,
  onDetail,
  onItemDetail,
  onPrint,
}) => {
  return (
    <>
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
            onItemDetail={onItemDetail}
            onPrint={onPrint}
            status={row.status}
            createdBy={row.created_by?.id}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const CaptainOrders = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState({});

  const { data, isSuccess, refetch } = useGetCaptainOrdersQuery({
    page,
    limit,
    search,
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
  const [printCaptainOrderDetail, setPrintCaptainOrderDetail] = useState(null);
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
      captain_order_number: searchQuery.captain_order_number || null,
    };

    const queryString = await objectToQueryString(updatedSearchQuery);
    setSearch(queryString);
  };

  const handleAdvancedSearch = async (advancedSearchQuery) => {
    setSearchQuery({ captain_order_number: null });
    const updatedSearchQuery = {
      captain_order_number: null,
      ...advancedSearchQuery,
    };

    setSearchQuery(updatedSearchQuery);
    setPage(1);

    const queryString = await objectToQueryString(updatedSearchQuery);
    setSearch(queryString);
  };

  const handleDetail = (captainOrderId, captainOrderStatus, items) => {
    setShowDetailModal(true);
    setDetailItems(items);
    setDetailCaptainOrder({
      captainOrderId: captainOrderId,
      captainOrderStatus: captainOrderStatus,
    });
  };

  const handlePrint = (captainOrderData) => {
    setShowPrintModal(true);
    setPrintCaptainOrderDetail(captainOrderData);
  };

  const handlePrintConfirmed = async () => {
    try {
      if (printCaptainOrderDetail.status === "PENDING") {
        const response = await approveCaptainOrderApi({
          id: parseInt(printCaptainOrderDetail.id),
        }).unwrap();
        setRows((prevRows) =>
          prevRows.map((captainOrder) =>
            captainOrder.id === response.id ? response : captainOrder
          )
        );

        enqueueSnackbar(`Captain Order printed successfully.`, {
          variant: "success",
        });
      }

      setPrintCaptainOrderDetail(null);
      setShowPrintModal(false);
    } catch (err) {
      setPrintCaptainOrderDetail(null);
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
            <Grid item xs={12} sm={6} sx={{ p: 1, pt: 2 }}>
              <TextField
                label="Search by captain order number"
                variant="outlined"
                size="small"
                value={searchQuery.captain_order_number || ""}
                onChange={(e) =>
                  setSearchQuery({ captain_order_number: e.target.value })
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
                    <TableCell>Captain Order Number</TableCell>
                    <TableCell>Captain Order Date</TableCell>
                    <TableCell>Operator</TableCell>
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
                      onEdit={() => navigate(`${row.id}/edit`)}
                      onDelete={() => handleDelete(row.id)}
                      onDetail={() => navigate(`${row.id}`)}
                      onItemDetail={() =>
                        handleDetail(row.id, row.status, row.items)
                      }
                      onPrint={() => handlePrint(row)}
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
        onSearch={(advancedSearchQuery) => {
          handleAdvancedSearch(advancedSearchQuery);
        }}
        getTemplate={getTemplate ? getTemplate : {}}
        searchQuery={searchQuery}
      />

      <PrintCaptainOrderModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onPrint={handlePrintConfirmed}
        getPrintData={printCaptainOrderDetail ? printCaptainOrderDetail : {}}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
  onItemDetail: PropTypes.func.isRequired,
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
  onItemDetail: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export default CaptainOrders;
