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
  useCreateOrderMutation,
  useGetOrderTemplateQuery,
} from "src/store/slices/purchases/orderApiSlice";
import MainCard from "src/components/MainCard";
import AddItemModal from "./AddItemModal";

const CreateOrder = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetOrderTemplateQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [rows, setRows] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleAddItem = (itemData) => {
    const existingIndex = rows.findIndex(
      (row) => row.product_id === itemData.product_id
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

  const calculateTotalPrice = () => {
    return rows.reduce(
      (total, row) => total + row.quantity * row.unit_price,
      0
    );
  };

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Create Purchase Order
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              order_date: dayjs(),
              order_number: "",
              items: [],
            }}
            validationSchema={Yup.object().shape({
              order_date: Yup.date()
                .required("Order Date is required")
                .max(new Date(), "Order Date cannot be in the future"),
              order_number: Yup.string().required("Order Number is required"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                if (rows.length === 0) {
                  enqueueSnackbar(
                    "Please add at least one item to the order.",
                    { variant: "error" }
                  );
                } else {
                  await createOrder({
                    order_date: new Date(values.order_date),
                    order_number: values.order_number,
                    items: rows,
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("Purchase Order created successfully.", {
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
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Order Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.order_date}
                          name="order_date"
                          id="order_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: { name: "order_date", value: date },
                            });
                          }}
                          error={Boolean(
                            touched.order_date && errors.order_date
                          )}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.order_date && errors.order_date
                              )}
                              helperText={
                                touched.order_date && errors.order_date
                              }
                              label="Order Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.order_date && errors.order_date && (
                        <Typography variant="body2" color="error">
                          {errors.order_date}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="order_number"
                        value={values.order_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Order Number"
                        error={Boolean(
                          touched.order_number && errors.order_number
                        )}
                      />
                      {touched.order_number && errors.order_number && (
                        <Typography variant="body2" color="error">
                          {errors.order_number}
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
                  </Grid>
                  <Grid item xs={12}>
                    <MainCard content={false}>
                      <Box
                        sx={{
                          minHeight: 200,
                          width: "99.8%",
                          maxWidth: "100%",
                          p: 1,
                        }}
                      >
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Remark</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
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
                                  <TableCell>{row.unit_price}</TableCell>
                                  <TableCell>
                                    {row.quantity * row.unit_price}
                                  </TableCell>
                                  <TableCell>{row.remark}</TableCell>
                                  <TableCell>
                                    <Tooltip title="Edit Item">
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => editItem(index)}
                                      >
                                        <EditOutlined />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Item">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => deleteItem(index)}
                                      >
                                        <DeleteOutlined />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {rows.length > 0 && (
                                <TableRow>
                                  <TableCell colSpan={3}></TableCell>
                                  <TableCell align="right">
                                    <strong>Total</strong>:
                                  </TableCell>
                                  <TableCell>{calculateTotalPrice()}</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              )}
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
        currentItem={currentItem !== null ? rows[currentItem] : null} // Pass the currentItem for editing
        getTemplate={getTemplate || {}}
      />
    </Grid>
  );
};

export default CreateOrder;
