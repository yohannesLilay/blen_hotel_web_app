import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useCreateStoreRequisitionMutation,
  useGetStoreRequisitionTemplateQuery,
} from "src/store/slices/sales/storeRequisitionApiSlice";
import MainCard from "src/components/MainCard";
import AddItemModal from "./AddItemModal";

const CreateStoreRequisition = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetStoreRequisitionTemplateQuery();
  const [createStoreRequisition, { isLoading }] =
    useCreateStoreRequisitionMutation();

  const [rows, setRows] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleAddItem = (itemData) => {
    const existingIndex = rows.findIndex(
      (row, index) =>
        index !== currentItem && row.product_id === itemData.product_id
    );

    if (existingIndex === -1) {
      if (currentItem === null) {
        setRows([...rows, itemData]);
      } else {
        const updatedRows = rows.map((row, index) =>
          index === currentItem ? itemData : row
        );
        setRows(updatedRows);
      }

      setIsAddItemModalOpen(false);
      setCurrentItem(null);
    } else {
      enqueueSnackbar("Item already exists. Please edit the existing item.", {
        variant: "error",
      });
    }
  };

  const editItem = (index) => {
    setCurrentItem(index);
    setIsAddItemModalOpen(true);
  };

  const deleteItem = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Create Store Requisition
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              store_requisition_date: dayjs(),
              items: [],
            }}
            validationSchema={Yup.object().shape({
              store_requisition_date: Yup.date()
                .required("Store Requisition Date is required")
                .max(
                  new Date(),
                  "Store Requisition Date cannot be in the future"
                ),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                if (rows.length === 0) {
                  enqueueSnackbar(
                    "Please add at least one item to the store requisition.",
                    { variant: "error" }
                  );
                } else {
                  await createStoreRequisition({
                    store_requisition_date: new Date(
                      values.store_requisition_date
                    ),
                    items: rows,
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("Store Requisition created successfully.", {
                    variant: "success",
                  });

                  setStatus({ success: false });
                  setSubmitting(false);
                }
              } catch (err) {
                setStatus({ success: false });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Store Requisition Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.store_requisition_date}
                          name="store_requisition_date"
                          id="store_requisition_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: {
                                name: "store_requisition_date",
                                value: date,
                              },
                            });
                          }}
                          error={Boolean(
                            touched.store_requisition_date &&
                              errors.store_requisition_date
                          )}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.store_requisition_date &&
                                  errors.store_requisition_date
                              )}
                              helperText={
                                touched.store_requisition_date &&
                                errors.store_requisition_date
                              }
                              label="Store Requisition Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.store_requisition_date &&
                        errors.store_requisition_date && (
                          <Typography variant="body2" color="error">
                            {errors.store_requisition_date}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-end"
                    spacing={1}
                  >
                    {values.order == null && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setCurrentItem(null); // Set the current item to null (new item)
                          setIsAddItemModalOpen(true); // Open the AddItemModal
                        }}
                        disabled={currentItem !== null}
                      >
                        Add Item
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <MainCard content={false}>
                      <Box sx={{ p: 0.5 }}>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Remark</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={8} align="center">
                                    <Typography variant="body1">
                                      No items available.
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                              {rows.map((row, index) => (
                                <TableRow
                                  key={row.id}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="left">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell>
                                    {getTemplate.productOptions.find(
                                      (product) => product.id === row.product_id
                                    )?.name || ""}
                                  </TableCell>
                                  <TableCell>{row.quantity}</TableCell>
                                  <TableCell>{row.remark}</TableCell>
                                  <TableCell align="right">
                                    <Tooltip title="Edit Item">
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => editItem(index)}
                                      >
                                        <EditOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    {values.order == null && (
                                      <Tooltip title="Delete Item">
                                        <IconButton
                                          color="error"
                                          size="small"
                                          onClick={() => deleteItem(index)}
                                        >
                                          <DeleteOutlined />
                                        </IconButton>
                                      </Tooltip>
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

                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-end"
                    spacing={1}
                  >
                    <Grid item>
                      <Button
                        disableElevation
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        disableElevation
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        sx={{ marginRight: 5 }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </MainCard>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setCurrentItem(null); // Reset currentItem when closing modal
          setIsAddItemModalOpen(false);
        }}
        onAdd={handleAddItem}
        currentItem={currentItem !== null ? rows[currentItem] : null}
        getTemplate={getTemplate || {}}
      />
    </Grid>
  );
};

export default CreateStoreRequisition;
