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
  useCreateReceivableMutation,
  useGetReceivableTemplateQuery,
} from "src/store/slices/purchases/receivableApiSlice";
import MainCard from "src/components/MainCard";

const CreateReceivable = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetReceivableTemplateQuery();
  const [createReceivable, { isLoading }] = useCreateReceivableMutation();

  const [rows, setRows] = useState([]);

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
            unit_price: 0,
            remark: "",
          },
        ]);
      } else {
        const updatedRows = rows.map((row, index) =>
          index === existingIndex
            ? { ...row, quantity: 1, unit_price: 0, remark: "" }
            : row
        );
        setRows(updatedRows);
      }
    }
  };

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Create GRV
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              receivable_date: dayjs(),
              supplier: null,
              order: null,
              products: [],
              items: [],
            }}
            validationSchema={Yup.object().shape({
              receivable_date: Yup.date()
                .required("GRV Date is required")
                .max(new Date(), "GRV Date cannot be in the future"),
              order: Yup.object()
                .shape({
                  id: Yup.number(),
                })
                .nullable(),
              supplier: Yup.object()
                .shape({
                  id: Yup.number(),
                })
                .nullable(),
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
                      parseInt(row.quantity, 10) > 0 &&
                      row.unit_price !== null &&
                      row.unit_price !== undefined &&
                      !isNaN(row.unit_price) &&
                      parseFloat(row.unit_price) > 0
                    );
                  });

                if (!isRowsValid) {
                  enqueueSnackbar(
                    "Please make sure all items have a valid quantity and unit price.",
                    { variant: "error" }
                  );
                } else {
                  await createReceivable({
                    receivable_date: new Date(values.receivable_date),
                    order_id: values.order?.id,
                    supplier_id: values.supplier?.id,
                    items: rows.map((r) => ({
                      ...r,
                      unit_price: parseFloat(r.unit_price) || 0,
                    })),
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("GRV created successfully.", {
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="GRV Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.receivable_date}
                          name="receivable_date"
                          id="receivable_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: { name: "receivable_date", value: date },
                            });
                          }}
                          error={Boolean(
                            touched.receivable_date && errors.receivable_date
                          )}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.receivable_date &&
                                  errors.receivable_date
                              )}
                              helperText={
                                touched.receivable_date &&
                                errors.receivable_date
                              }
                              label="GRV Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.receivable_date && errors.receivable_date && (
                        <Typography variant="body2" color="error">
                          {errors.receivable_date}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.order && errors.order)}
                      >
                        <Autocomplete
                          id="order"
                          options={getTemplate?.orderOptions || []}
                          value={values.order || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "order", value: newValue },
                            });

                            if (newValue && newValue.items) {
                              const modifiedItems = newValue.items.map(
                                (item) => {
                                  if (item.product && item.product.id) {
                                    return {
                                      ...item,
                                      product_id: item.product.id,
                                      product: undefined,
                                      unit_price: 0,
                                    };
                                  } else {
                                    return item;
                                  }
                                }
                              );

                              setRows(modifiedItems);
                            } else {
                              setRows([]);
                            }
                          }}
                          getOptionLabel={(option) => option.order_number}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Purchase Order"
                              variant="outlined"
                              error={Boolean(touched.order && errors.order)}
                            />
                          )}
                          disabled={rows.length > 0 && values.order === null}
                        />
                      </FormControl>
                      {touched.order && errors.order && (
                        <Typography variant="body2" color="error">
                          {errors.order}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.supplier && errors.supplier)}
                      >
                        <Autocomplete
                          id="supplier"
                          options={getTemplate?.supplierOptions || []}
                          value={values.supplier || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "supplier", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Supplier"
                              variant="outlined"
                              error={Boolean(
                                touched.supplier && errors.supplier
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.supplier && errors.supplier && (
                        <Typography variant="body2" color="error">
                          {errors.supplier}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
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
                          disabled={values.order !== null}
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
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Total Price</TableCell>
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
                                  <TableCell style={{ width: 200 }}>
                                    {getTemplate.productOptions.find(
                                      (product) => product.id === row.product_id
                                    )?.name || ""}
                                  </TableCell>
                                  <TableCell style={{ width: 100 }}>
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
                                  <TableCell style={{ width: 140 }}>
                                    <TextField
                                      size="small"
                                      value={row.unit_price}
                                      onChange={(e) => {
                                        const decimalValue =
                                          e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          );

                                        const dotCount = (
                                          decimalValue.match(/\./g) || []
                                        ).length;

                                        if (dotCount <= 1) {
                                          const updatedRows = rows.map((r, i) =>
                                            i === index
                                              ? {
                                                  ...r,
                                                  unit_price: decimalValue,
                                                }
                                              : r
                                          );
                                          setRows(updatedRows);
                                        }
                                      }}
                                      inputProps={{ min: 1, step: 0.01 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {row.quantity * row.unit_price}
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
                                    {values.order == null && (
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
                                    )}
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
    </Grid>
  );
};

export default CreateReceivable;
