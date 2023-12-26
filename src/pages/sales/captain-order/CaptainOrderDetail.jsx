import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
  PrintOutlined,
  ArrowBackOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import PrintCaptainOrderModal from "./PrintCaptainOrderModal";
import AddItemModal from "./AddItemModal";
import {
  useGetCaptainOrderQuery,
  useGetCaptainOrderTemplateQuery,
  usePrintCaptainOrderMutation,
  useDeleteCaptainOrderMutation,
  useCreateCaptainOrderItemMutation,
  useDeleteCaptainOrderItemMutation,
} from "src/store/slices/sales/captainOrderApiSlice";

const ActionButtons = ({ onEdit, onDelete, onPrint, status, createdBy }) => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.userInfo);

  return (
    <div>
      <Tooltip title="Back to Captain Orders">
        <IconButton
          color="primary"
          size="large"
          onClick={() => navigate("../")}
        >
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
      <PermissionGuard permission="add_captain_order">
        <Tooltip title="Add New Captain Order">
          <IconButton
            color="primary"
            size="large"
            onClick={() => navigate("../create")}
          >
            <AddOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="print_captain_order">
        <Tooltip title="Print Captain Order">
          <IconButton color="primary" size="large" onClick={onPrint}>
            <PrintOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      {status === "PENDING" && createdBy === currentUser.userId && (
        <PermissionGuard permission="change_captain_order">
          <Tooltip title="Edit Captain Order">
            <IconButton color="primary" size="large" onClick={onEdit}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
      {status === "PENDING" && createdBy === currentUser.userId && (
        <PermissionGuard permission="delete_captain_order">
          <Tooltip title="Delete Captain Order">
            <IconButton color="error" size="large" onClick={onDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </PermissionGuard>
      )}
    </div>
  );
};

const CaptainOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getCaptainOrder, refetch } = useGetCaptainOrderQuery(id);
  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [captainOrderDeleteApi] = useDeleteCaptainOrderMutation();
  const [captainOrderItemDeleteApi] = useDeleteCaptainOrderItemMutation();
  const [approveCaptainOrderApi] = usePrintCaptainOrderMutation();
  const [captainOrderCreateApi] = useCreateCaptainOrderItemMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);
  const [itemActionDetail, setItemActionDetail] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const handleEdit = () => {
    navigate(`edit`);
  };

  const handlePrintConfirmed = async () => {
    try {
      if (getCaptainOrder?.status === "PENDING") {
        await approveCaptainOrderApi({
          id: parseInt(getCaptainOrder.id),
        }).unwrap();

        enqueueSnackbar(`Captain Order printed successfully.`, {
          variant: "success",
        });
      }

      setShowPrintModal(false);
    } catch (err) {
      setShowPrintModal(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      await captainOrderCreateApi({
        ...itemData,
        id: id,
      }).unwrap();
      enqueueSnackbar("Captain Order item added successfully.", {
        variant: "success",
      });

      refetch();
      showAddItemModal(false);
    } catch (err) {
      showAddItemModal(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await captainOrderDeleteApi(id).unwrap();
      enqueueSnackbar("Captain Order deleted successfully.", {
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

  const handleItemDeleteConfirmed = async () => {
    try {
      await captainOrderItemDeleteApi({
        id: parseInt(id),
        item_id: parseInt(itemActionDetail),
      }).unwrap();
      enqueueSnackbar("Item from Captain Order deleted successfully.", {
        variant: "success",
      });

      refetch();
      setShowItemDeleteModal(false);
      setItemActionDetail(null);
    } catch (err) {
      setShowItemDeleteModal(false);
      setItemActionDetail(null);
    }
  };

  if (!getCaptainOrder) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Captain Order Detail</Typography>
          </Grid>
          <Grid item>
            <ActionButtons
              onEdit={handleEdit}
              onDelete={() => {
                setShowDeleteModal(true);
              }}
              onPrint={() => setShowPrintModal(true)}
              status={getCaptainOrder.status}
              createdBy={getCaptainOrder.created_by?.id}
            />
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Paper elevation={1} sx={{ p: 1, m: 1 }}>
            <Box sx={{ p: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Order No:</span>{" "}
                    {getCaptainOrder.captain_order_number}
                  </Box>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Order Date:</span>{" "}
                    {dayjs(getCaptainOrder.captain_order_date).format(
                      "DD-MM-YYYY"
                    )}
                  </Box>
                  <Box component="div">
                    <span style={{ fontWeight: "bold" }}>Operator:</span>{" "}
                    {getCaptainOrder.created_by?.name}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Waiter:</span>{" "}
                    {getCaptainOrder.waiter?.name}
                  </Box>
                  <Box component="div" mb={1}>
                    <span style={{ fontWeight: "bold" }}>Facility:</span>{" "}
                    {getCaptainOrder.facility_type?.name}
                  </Box>
                  <Box component="div">
                    <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
                    {getCaptainOrder.status}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Box sx={{ p: 1 }}>
            <Grid container justifyContent="flex-end" sx={{ pb: 1 }}>
              <Grid item>
                {getCaptainOrder.status === "PENDING" && (
                  <PermissionGuard permission="add_captain_order">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowAddItemModal(true)}
                    >
                      <AddOutlined /> Add More Item
                    </Button>
                  </PermissionGuard>
                )}
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Menu Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell align="right">
                      <PermissionGuard permission="add_captain_order">
                        {getCaptainOrder.status === "PENDING" && "Action"}
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCaptainOrder.items.map((row, index) => (
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
                        {row.menu?.item}{" "}
                        {row.menu?.item_local_name &&
                          ` (${row.menu.item_local_name})`}
                      </TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell align="right">
                        {getCaptainOrder.status === "PENDING" && (
                          <PermissionGuard permission="add_captain_order">
                            <Tooltip
                              title="Delete Item"
                              placement="bottom-start"
                            >
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setShowItemDeleteModal(true);
                                  setItemActionDetail(row.id);
                                }}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                        )}
                      </TableCell>
                    </TableRow>
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
        dialogContent="Are you sure you want to delete this Captain Order?"
      />

      <DeleteModal
        open={showItemDeleteModal}
        onClose={() => setShowItemDeleteModal(false)}
        onDelete={handleItemDeleteConfirmed}
        dialogContent="Are you sure you want to delete this Item from the Captain Order?"
      />

      <PrintCaptainOrderModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onPrint={handlePrintConfirmed}
        getPrintData={getCaptainOrder || {}}
      />

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
        }}
        onAdd={handleAddItem}
        currentItem={null}
        getTemplate={getTemplate || {}}
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
};

export default CaptainOrderDetail;
