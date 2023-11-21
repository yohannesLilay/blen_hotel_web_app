import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

const CreateCaptainOrder = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [createCaptainOrder, { isLoading }] = useCreateCaptainOrderMutation();

  const [rows, setRows] = useState([]);

  const handleSelectedMenu = (selectedMenu) => {
    if (selectedMenu) {
      const existingIndex = rows.findIndex(
        (row) => row.menu_id === selectedMenu.id
      );

      if (existingIndex === -1) {
        setRows([
          ...rows,
          {
            id: Math.random().toString(36),
            menu_id: selectedMenu.id,
            quantity: 1,
          },
        ]);
      } else {
        const updatedRows = rows.map((row, index) =>
          index === existingIndex ? { ...row, quantity: 1 } : row
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
              menus: [],
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
              menus: Yup.array()
                .required("At lease one menu item is required")
                .min(1, "At least one menu item is required"),
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
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.waiter && errors.waiter)}
                      >
                        <Autocomplete
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(
                          touched.facility_type && errors.facility_type
                        )}
                      >
                        <Autocomplete
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
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.menus && errors.menus)}
                      >
                        <Autocomplete
                          multiple
                          limitTags={4}
                          disableCloseOnSelect
                          id="menus"
                          options={getTemplate?.menuOptions || []}
                          value={values.menus}
                          onChange={(event, newValue) => {
                            const removedMenus = values.menus.filter(
                              (menu) =>
                                !newValue.some(
                                  (selectedMenu) => selectedMenu.id === menu.id
                                )
                            );
                            if (removedMenus.length > 0) {
                              const updatedRows = rows.filter(
                                (row) => row.menu_id !== removedMenus[0].id
                              );
                              setRows(updatedRows);
                            } else {
                              const selectedMenu =
                                newValue[newValue.length - 1];
                              handleSelectedMenu(selectedMenu);
                            }

                            handleChange({
                              target: { name: "menus", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.item}
                          renderOption={(props, option, state) => (
                            <li {...props}>
                              <Checkbox
                                checked={state.selected}
                                onChange={() => {}}
                              />
                              {option.item}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Menus"
                              variant="outlined"
                              error={Boolean(touched.menus && errors.menus)}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.menus && errors.menus && (
                        <Typography variant="body2" color="error">
                          {errors.menus}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>

                  <Grid container spacing={2} sx={{ margin: 1 }}>
                    {rows.map((row, index) => (
                      <Grid item key={row.id} xs={12} sm={4} md={3} lg={3}>
                        <Card sx={{ minWidth: 275, maxWidth: 400 }}>
                          <CardContent>
                            <Stack
                              spacing={1}
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              sx={{ marginBottom: 1 }}
                            >
                              <Typography variant="h6">
                                {getTemplate.menuOptions.find(
                                  (menu) => menu.id === row.menu_id
                                )?.item || ""}
                              </Typography>
                            </Stack>
                            <Stack
                              spacing={1}
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Button
                                onClick={() => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].quantity = Math.max(
                                    1,
                                    updatedRows[index].quantity - 1
                                  );
                                  setRows(updatedRows);
                                }}
                              >
                                <RemoveOutlined />
                              </Button>
                              <Typography variant="h5">
                                {row.quantity}
                              </Typography>
                              <Button
                                onClick={() => {
                                  const updatedRows = [...rows];
                                  updatedRows[index].quantity += 1;
                                  setRows(updatedRows);
                                }}
                              >
                                <AddOutlined />
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
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

export default CreateCaptainOrder;
