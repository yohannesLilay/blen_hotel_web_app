import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  useUpdateCaptainOrderMutation,
  useGetCaptainOrderQuery,
  useGetCaptainOrderTemplateQuery,
} from "src/store/slices/sales/captainOrderApiSlice";
import MainCard from "src/components/MainCard";

const EditCaptainOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getCaptainOrder } = useGetCaptainOrderQuery(id);
  const { data: getTemplate } = useGetCaptainOrderTemplateQuery();
  const [updateCaptainOrder, { isLoading }] = useUpdateCaptainOrderMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Captain Order
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              captain_order_date:
                dayjs(getCaptainOrder?.captain_order_date) || null,
              waiter:
                getTemplate?.waiterStaffOptions.find(
                  (option) => option.id === getCaptainOrder?.waiter?.id
                ) || null,
              facility_type:
                getTemplate?.facilityTypeOptions.find(
                  (option) => option.id === getCaptainOrder?.facility_type?.id
                ) || null,
            }}
            validationSchema={Yup.object().shape({
              captain_order_date: Yup.date()
                .required("Captain Order Date is required")
                .max(new Date(), "Captain Order Date cannot be in the future"),
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
            onSubmit={async (values) => {
              await updateCaptainOrder({
                id: parseInt(id),
                captain_order_date: values.captain_order_date,
                waiter: values.waiter?.id || null,
                facility_type_id: values.facility_type?.id || null,
              }).unwrap();
              navigate(`../${id}`);
              enqueueSnackbar("Captain Order updated successfully.", {
                variant: "success",
              });
            }}
            enableReinitialize
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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

export default EditCaptainOrder;
