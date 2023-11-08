import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
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
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
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
import AddItemModal from "./AddItemModal";

const CreateReceivable = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetReceivableTemplateQuery();
  const [createReceivable, { isLoading }] = useCreateReceivableMutation();

  const [rows, setRows] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isDerivedFromOrder, setIsDerivedFromOrder] = useState(false);

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
            Create Purchase Receivable
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              receivable_date: dayjs(),
              receivable_number: "",
              supplier: null,
              order: null,
              items: [],
            }}
            validationSchema={Yup.object().shape({
              receivable_date: Yup.date()
                .required("Effective Date is required")
                .max(new Date(), "Effective Date cannot be in the future"),
              receivable_number: Yup.string().required(
                "Receivable Number is required"
              ),
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
                if (rows.length === 0) {
                  enqueueSnackbar(
                    "Please add at least one item to the receivable.",
                    { variant: "error" }
                  );
                } else {
                  await createReceivable({
                    receivable_date: new Date(values.receivable_date),
                    receivable_number: values.receivable_number,
                    order_id: values.order?.id,
                    supplier_id: values.supplier?.id,
                    items: rows,
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("Purchase Receivable created successfully.", {
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
                          label="Receivable Date"
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
                              label="Effective Date"
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
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="receivable_number"
                        value={values.receivable_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Receivable Number"
                        error={Boolean(
                          touched.receivable_number && errors.receivable_number
                        )}
                      />
                      {touched.receivable_number &&
                        errors.receivable_number && (
                          <Typography variant="body2" color="error">
                            {errors.receivable_number}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.order && errors.order)}
                      >
                        <Autocomplete
                          disablePortal
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
                                    };
                                  } else {
                                    return item;
                                  }
                                }
                              );

                              setRows(modifiedItems);
                              setIsDerivedFromOrder(true);
                            } else {
                              setRows([]);
                              setIsDerivedFromOrder(false);
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
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.supplier && errors.supplier)}
                      >
                        <Autocomplete
                          disablePortal
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
        currentItem={currentItem !== null ? rows[currentItem] : null}
        getTemplate={getTemplate || {}}
        areItemsFromOrder={isDerivedFromOrder}
      />
    </Grid>
  );
};

export default CreateReceivable;
