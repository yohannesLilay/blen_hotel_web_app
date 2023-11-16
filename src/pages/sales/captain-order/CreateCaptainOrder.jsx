import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  FormControl,
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
  useCreateCaptainOrderMutation,
  useGetCaptainOrderTemplateQuery,
} from "src/store/slices/sales/captainOrderApiSlice";
import MainCard from "src/components/MainCard";
import AddItemModal from "./AddItemModal";

const CreateCaptainOrder = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [createCaptainOrder, { isLoading }] = useCreateCaptainOrderMutation();

  const [rows, setRows] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleAddItem = (itemData) => {
    const existingIndex = rows.findIndex(
      (row, index) => index !== currentItem && row.menu_id === itemData.menu_id
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
            Create Captain Order
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              captain_order_date: dayjs(),
              captain_order_number: "",
              waiter: null,
              facility_type: null,
              items: [],
            }}
            validationSchema={Yup.object().shape({
              captain_order_date: Yup.date()
                .required("Captain Order Date is required")
                .max(new Date(), "Captain Order Date cannot be in the future"),
              captain_order_number: Yup.string().required(
                "Captain Order Number is required"
              ),
              waiter: Yup.object()
                .shape({
                  id: Yup.number().required("Waiter is required"),
                })
                .required("Waiter is required"),
              facility_type: Yup.object()
                .shape({
                  id: Yup.number().required("Facility is required"),
                })
                .required("Facility is required"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                if (rows.length === 0) {
                  enqueueSnackbar(
                    "Please add at least one item to the captain order.",
                    { variant: "error" }
                  );
                } else {
                  await createCaptainOrder({
                    captain_order_date: new Date(values.captain_order_date),
                    captain_order_number: values.captain_order_number,
                    waiter: values.waiter?.id,
                    facility_type_id: values.facility_type?.id,
                    items: rows,
                  }).unwrap();
                  navigate(-1);
                  enqueueSnackbar("Captain Order created successfully.", {
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
                          label="Captain Order Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.captain_order_date}
                          name="captain_order_date"
                          id="captain_order_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: {
                                name: "captain_order_date",
                                value: date,
                              },
                            });
                          }}
                          error={Boolean(
                            touched.captain_order_date &&
                              errors.captain_order_date
                          )}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.captain_order_date &&
                                  errors.captain_order_date
                              )}
                              helperText={
                                touched.captain_order_date &&
                                errors.captain_order_date
                              }
                              label="Captain Order Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.captain_order_date &&
                        errors.captain_order_date && (
                          <Typography variant="body2" color="error">
                            {errors.captain_order_date}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="captain_order_number"
                        value={values.captain_order_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Captain Order Number"
                        error={Boolean(
                          touched.captain_order_number &&
                            errors.captain_order_number
                        )}
                      />
                      {touched.captain_order_number &&
                        errors.captain_order_number && (
                          <Typography variant="body2" color="error">
                            {errors.captain_order_number}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "waiter", value: newValue },
                            });
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
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(
                          touched.facility_type && errors.facility_type
                        )}
                      >
                        <Autocomplete
                          disablePortal
                          id="facility_type"
                          options={getTemplate?.facilityTypeOptions || []}
                          value={values.facility_type || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: {
                                name: "facility_type",
                                value: newValue,
                              },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Facility"
                              variant="outlined"
                              error={Boolean(
                                touched.facility_type && errors.facility_type
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.facility_type && errors.facility_type && (
                        <Typography variant="body2" color="error">
                          {errors.facility_type}
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
                                <TableCell>Menu</TableCell>
                                <TableCell>Quantity</TableCell>
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
                                    {getTemplate.menuOptions.find(
                                      (menu) => menu.id === row.menu_id
                                    )?.item || ""}
                                  </TableCell>
                                  <TableCell>{row.quantity}</TableCell>
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

export default CreateCaptainOrder;
