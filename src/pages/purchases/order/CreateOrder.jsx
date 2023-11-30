import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
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
import { DeleteOutlined } from "@mui/icons-material";
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

const CreateOrder = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetOrderTemplateQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [rows, setRows] = useState([]);

  const handleSelectedProduct = (selectedProduct) => {
    if (selectedProduct) {
      const existingIndex = rows.findIndex(
        (row) => row.product_id === selectedProduct.id
      );

      if (existingIndex === -1) {
        setRows([
          ...rows,
          {
            id: Math.random().toString(36),
            product_id: selectedProduct.id,
            quantity: 1,
            remark: "",
          },
        ]);
      } else {
        const updatedRows = rows.map((row, index) =>
          index === existingIndex ? { ...row, quantity: 1, remark: "" } : row
        );
        setRows(updatedRows);
      }
    }
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
              products: [],
              items: [],
            }}
            validationSchema={Yup.object().shape({
              order_date: Yup.date()
                .required("Order Date is required")
                .max(new Date(), "Order Date cannot be in the future"),
              products: Yup.array()
                .required("At lease one product item is required")
                .min(1, "At least one product item is required"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                const isRowsValid =
                  rows.length > 0 &&
                  rows.every((row) => {
                    return (
                      row.quantity !== null &&
                      row.quantity !== undefined &&
                      !isNaN(row.quantity) &&
                      parseInt(row.quantity, 10) > 0
                    );
                  });

                if (!isRowsValid) {
                  enqueueSnackbar(
                    "Please make sure all items have a valid quantity.",
                    { variant: "error" }
                  );
                } else {
                  await createOrder({
                    order_date: new Date(values.order_date),
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
                  <Grid item xs={12} sm={3}>
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
                  <Grid item xs={12} sm={9}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.products && errors.products)}
                      >
                        <Autocomplete
                          multiple
                          limitTags={4}
                          disableCloseOnSelect
                          id="products"
                          options={getTemplate?.productOptions || []}
                          value={values.products}
                          onChange={(event, newValue) => {
                            const removedProducts = values.products.filter(
                              (product) =>
                                !newValue.some(
                                  (selectedProduct) =>
                                    selectedProduct.id === product.id
                                )
                            );
                            if (removedProducts.length > 0) {
                              const updatedRows = rows.filter(
                                (row) =>
                                  row.product_id !== removedProducts[0].id
                              );
                              setRows(updatedRows);
                            } else {
                              const selectedProduct =
                                newValue[newValue.length - 1];
                              handleSelectedProduct(selectedProduct);
                            }

                            handleChange({
                              target: { name: "products", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option, state) => (
                            <li {...props}>
                              <Checkbox
                                checked={state.selected}
                                onChange={() => {}}
                              />
                              {option.name}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Products"
                              variant="outlined"
                              error={Boolean(
                                touched.products && errors.products
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.products && errors.products && (
                        <Typography variant="body2" color="error">
                          {errors.products}
                        </Typography>
                      )}
                    </Stack>
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
                                  <TableCell style={{ width: 300 }}>
                                    {getTemplate.productOptions.find(
                                      (product) => product.id === row.product_id
                                    )?.name || ""}
                                  </TableCell>
                                  <TableCell style={{ width: 120 }}>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={row.quantity}
                                      onChange={(e) => {
                                        const integerValue =
                                          e.target.value.replace(/[^0-9]/g, "");
                                        const updatedRows = rows.map((r, i) =>
                                          i === index
                                            ? {
                                                ...r,
                                                quantity: parseInt(
                                                  integerValue,
                                                  10
                                                ),
                                              }
                                            : r
                                        );
                                        setRows(updatedRows);
                                      }}
                                      inputProps={{ min: 1 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      size="small"
                                      value={row.remark}
                                      onChange={(e) => {
                                        const updatedRows = rows.map((r, i) =>
                                          i === index
                                            ? { ...r, remark: e.target.value }
                                            : r
                                        );
                                        setRows(updatedRows);
                                      }}
                                      fullWidth
                                    />
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    style={{ width: 80 }}
                                  >
                                    <Tooltip title="Delete Item">
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                          deleteItem(index);

                                          const updatedProducts =
                                            values.products.filter(
                                              (product) =>
                                                product.id !==
                                                rows[index].product_id
                                            );
                                          handleChange({
                                            target: {
                                              name: "products",
                                              value: updatedProducts,
                                            },
                                          });
                                        }}
                                      >
                                        <DeleteOutlined />
                                      </IconButton>
                                    </Tooltip>
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
    </Grid>
  );
};

export default CreateOrder;
