import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Grid, TextField, Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  useUpdateOrderMutation,
  useGetOrderQuery,
} from "src/store/slices/purchases/orderApiSlice";
import MainCard from "src/components/MainCard";

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getOrder } = useGetOrderQuery(id);
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Order
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              order_number: getOrder?.order_number || "",
              order_date: dayjs(getOrder?.order_date) || null,
            }}
            validationSchema={Yup.object().shape({
              order_number: Yup.string().required("Order Number is required"),
              order_date: Yup.date()
                .required("Order Date is required")
                .max(new Date(), "Order Date cannot be in the future"),
            })}
            onSubmit={async (values) => {
              await updateOrder({
                id: parseInt(id),
                order_number: values.order_number,
                unit_of_measure: values.unit_of_measure,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Order updated successfully.", {
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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

export default EditOrder;
