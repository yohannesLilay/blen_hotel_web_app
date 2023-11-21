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
  useUpdateReceivableMutation,
  useGetReceivableQuery,
  useGetReceivableTemplateQuery,
} from "src/store/slices/purchases/receivableApiSlice";
import MainCard from "src/components/MainCard";

const EditReceivable = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetReceivableTemplateQuery();
  const { data: getReceivable } = useGetReceivableQuery(id);
  const [updateReceivable, { isLoading }] = useUpdateReceivableMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit GRV
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              receivable_number: getReceivable?.receivable_number || "",
              receivable_date: dayjs(getReceivable?.receivable_date) || null,
              supplier:
                getTemplate?.supplierOptions.find(
                  (option) => option.id === getReceivable?.supplier?.id
                ) || null,
            }}
            validationSchema={Yup.object().shape({
              receivable_number: Yup.string().required(
                "GRV Number is required"
              ),
              receivable_date: Yup.date()
                .required("GRV Date is required")
                .max(new Date(), "GRV Date cannot be in the future"),
              supplier: Yup.object()
                .shape({
                  id: Yup.number(),
                })
                .nullable(),
            })}
            onSubmit={async (values) => {
              await updateReceivable({
                id: parseInt(id),
                receivable_number: values.receivable_number,
                receivable_date: values.receivable_date,
                supplier_id: values.supplier?.id || null,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("GRV updated successfully.", {
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
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="receivable_number"
                        value={values.receivable_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="GRV Number"
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
                  <Grid item xs={12} sm={6}>
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

export default EditReceivable;
