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
  useUpdateStoreRequisitionMutation,
  useGetStoreRequisitionQuery,
} from "src/store/slices/sales/storeRequisitionApiSlice";
import MainCard from "src/components/MainCard";

const EditStoreRequisition = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getStoreRequisition } = useGetStoreRequisitionQuery(id);
  const [updateStoreRequisition, { isLoading }] =
    useUpdateStoreRequisitionMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Store Requisition
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              store_requisition_date:
                dayjs(getStoreRequisition?.store_requisition_date) || null,
            }}
            validationSchema={Yup.object().shape({
              store_requisition_date: Yup.date()
                .required("Store Requisition Date is required")
                .max(
                  new Date(),
                  "Store Requisition Date cannot be in the future"
                ),
            })}
            onSubmit={async (values) => {
              await updateStoreRequisition({
                id: parseInt(id),
                store_requisition_date: values.store_requisition_date,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Store Requisition updated successfully.", {
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

export default EditStoreRequisition;
