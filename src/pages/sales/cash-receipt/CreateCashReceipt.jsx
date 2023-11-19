import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  FormControl,
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useCreateCashReceiptMutation,
  useGetCashReceiptTemplateQuery,
} from "src/store/slices/sales/cashReceiptApiSlice";
import MainCard from "src/components/MainCard";

const CreateCashReceipt = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("");

  const { data: getTemplate } = useGetCashReceiptTemplateQuery({ filter });
  const [createCashReceipt, { isLoading }] = useCreateCashReceiptMutation();

  const [rows, setRows] = useState([]);

  const calculateTotalPrice = () => {
    return rows.reduce(
      (total, row) => total + row.quantity * row.unit_price,
      0
    );
  };

  const objectToQueryString = (obj) => {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");
  };

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Create Cash Receipt
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              cash_receipt_date: dayjs(),
              cash_receipt_number: "",
              waiter: null,
              captain_orders: [],
              items: [],
            }}
            validationSchema={Yup.object().shape({
              cash_receipt_date: Yup.date()
                .required("Cash Receipt Date is required")
                .max(new Date(), "Cash Receipt Date cannot be in the future"),
              cash_receipt_number: Yup.string().required(
                "Cash Receipt Number is required"
              ),
              waiter: Yup.object()
                .shape({
                  id: Yup.number().required("Waiter is required"),
                })
                .required("Waiter is required"),
              captain_orders: Yup.array()
                .required("Captain Order are required")
                .min(1, "At least one captain order is required"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                if (rows.length === 0) {
                  enqueueSnackbar(
                    "Please add at least one item to the captain order.",
                    { variant: "error" }
                  );
                } else {
                  await createCashReceipt({
                    cash_receipt_date: new Date(values.cash_receipt_date),
                    cash_receipt_number: values.cash_receipt_number,
                    waiter: values.waiter?.id,
                    captain_order_ids: values.captain_orders?.map(
                      (captain_order) => captain_order.id
                    ),
                    items: rows,
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("Cash Receipt created successfully.", {
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
                  <Grid item xs={12} sm={6} md={2}>
                    <Stack spacing={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Cash Receipt Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.cash_receipt_date}
                          name="cash_receipt_date"
                          id="cash_receipt_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: {
                                name: "cash_receipt_date",
                                value: date,
                              },
                            });
                          }}
                          error={Boolean(
                            touched.cash_receipt_date &&
                              errors.cash_receipt_date
                          )}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.cash_receipt_date &&
                                  errors.cash_receipt_date
                              )}
                              helperText={
                                touched.cash_receipt_date &&
                                errors.cash_receipt_date
                              }
                              label="Cash Receipt Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.cash_receipt_date &&
                        errors.cash_receipt_date && (
                          <Typography variant="body2" color="error">
                            {errors.cash_receipt_date}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="cash_receipt_number"
                        value={values.cash_receipt_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Cash Receipt Number"
                        error={Boolean(
                          touched.cash_receipt_number &&
                            errors.cash_receipt_number
                        )}
                      />
                      {touched.cash_receipt_number &&
                        errors.cash_receipt_number && (
                          <Typography variant="body2" color="error">
                            {errors.cash_receipt_number}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.waiter && errors.waiter)}
                      >
                        <Autocomplete
                          disablePortal
                          id="waiter"
                          options={getTemplate?.waiterStaffOptions || []}
                          value={values.waiter || null}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "waiter", value: newValue },
                            });

                            handleChange({
                              target: { name: "captain_orders", value: [] },
                            });

                            setRows([]);
                            setFilter(
                              objectToQueryString({
                                waiter: newValue?.id || null,
                              })
                            );
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Waiter"
                              variant="outlined"
                              error={Boolean(touched.waiter && errors.waiter)}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.waiter && errors.waiter && (
                        <Typography variant="body2" color="error">
                          {errors.waiter}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(
                          touched.captain_orders && errors.captain_orders
                        )}
                      >
                        <Autocomplete
                          multiple
                          limitTags={3}
                          disablePortal
                          id="captain_orders"
                          options={getTemplate?.captainOrderOptions || []}
                          value={values.captain_orders || []}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: {
                                name: "captain_orders",
                                value: newValue,
                              },
                            });

                            if (!newValue || newValue.length === 0) {
                              setRows([]);
                            } else if (
                              newValue.length <
                              (values.captain_orders || []).length
                            ) {
                              const removedItems = values.captain_orders
                                .filter(
                                  (order) =>
                                    !newValue.some(
                                      (newOrder) => newOrder.id === order.id
                                    )
                                )
                                .map((order) =>
                                  order.items.map((item) => ({
                                    id: item.id,
                                    menu_id: item.menu.id,
                                  }))
                                )
                                .flat();

                              const updatedRows = rows.reduce((acc, row) => {
                                const matchingRemovedItem = removedItems.find(
                                  (removedItem) =>
                                    removedItem.menu_id === row.menu_id
                                );

                                if (matchingRemovedItem) {
                                  const correspondingOrder =
                                    values.captain_orders.find((order) =>
                                      order.items.some(
                                        (item) =>
                                          item.id === matchingRemovedItem.id
                                      )
                                    );
                                  const removedQuantity =
                                    correspondingOrder.items.find(
                                      (item) =>
                                        item.id === matchingRemovedItem.id
                                    )?.quantity || 0;

                                  if (row.quantity > removedQuantity) {
                                    acc.push({
                                      ...row,
                                      quantity: row.quantity - removedQuantity,
                                    });
                                  }
                                } else {
                                  acc.push(row);
                                }

                                return acc;
                              }, []);

                              setRows(updatedRows);
                            } else {
                              const updatedRows = [...rows];
                              const lastSelectedCaptainOrder =
                                newValue[newValue.length - 1];

                              if (lastSelectedCaptainOrder) {
                                const items = lastSelectedCaptainOrder.items;

                                items.forEach((item) => {
                                  const existingRow = updatedRows.find(
                                    (row) => row.menu_id === item.menu.id
                                  );

                                  if (existingRow) {
                                    existingRow.quantity += item.quantity;
                                  } else {
                                    if (item.menu && item.menu.id) {
                                      updatedRows.push({
                                        ...item,
                                        menu_id: item.menu.id,
                                        unit_price: item.menu.price,
                                        menu: undefined,
                                      });
                                    } else {
                                      updatedRows.push(item);
                                    }
                                  }
                                });
                              }

                              setRows(updatedRows);
                            }
                          }}
                          getOptionLabel={(option) =>
                            option.captain_order_number
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Captain Order"
                              variant="outlined"
                              error={Boolean(
                                touched.captain_orders && errors.captain_orders
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.captain_orders && errors.captain_orders && (
                        <Typography variant="body2" color="error">
                          {errors.captain_orders}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <MainCard content={false}>
                      <Box
                        sx={{
                          maxWidth: "100%",
                        }}
                      >
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Menu</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Total Price</TableCell>
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
                                    {getTemplate.menuOptions.find(
                                      (menu) => menu.id === row.menu_id
                                    )?.item || ""}
                                  </TableCell>
                                  <TableCell>{row.quantity}</TableCell>
                                  <TableCell>{row.unit_price} BIRR</TableCell>
                                  <TableCell>
                                    {row.unit_price * row.quantity} BIRR
                                  </TableCell>
                                </TableRow>
                              ))}
                              {rows.length > 0 && (
                                <TableRow>
                                  <TableCell colSpan={3}></TableCell>
                                  <TableCell align="right">
                                    <strong>Total</strong>:
                                  </TableCell>
                                  <TableCell>
                                    {calculateTotalPrice()} BIRR
                                  </TableCell>
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

export default CreateCashReceipt;
