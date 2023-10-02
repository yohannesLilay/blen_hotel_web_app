import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Grid, TextField, Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useUpdateSupplierMutation,
  useGetSupplierQuery,
} from "src/store/slices/configurations/supplierApiSlice";
import MainCard from "src/components/MainCard";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getSupplier } = useGetSupplierQuery(id);
  const [updateSupplier, { isLoading }] = useUpdateSupplierMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Supplier
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getSupplier?.name || "",
              email: getSupplier?.email || "",
              phone_number: (getSupplier?.phone_number || "").replace(
                /^\+251/,
                ""
              ),
              address: getSupplier?.address || "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              email: Yup.string().email("Must be a valid email"),
              phone_number: Yup.string()
                .required("Phone Number is required")
                .test(
                  "is-nine-digits",
                  "Phone Number must be a 9-digit number",
                  (value) => {
                    if (value === undefined) return true;
                    const stringValue = value.toString();
                    return (
                      stringValue.length === 9 && /^\d+$/.test(stringValue)
                    );
                  }
                ),
              address: Yup.string(),
            })}
            onSubmit={async (values) => {
              await updateSupplier({
                id: parseInt(id),
                name: values.name,
                email: values.email,
                phone_number: "+251" + values.phone_number,
                address: values.address,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Supplier updated successfully.", {
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
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="name"
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Name"
                        error={Boolean(touched.name && errors.name)}
                      />
                      {touched.name && errors.name && (
                        <Typography variant="body2" color="error">
                          {errors.name}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Email"
                        error={Boolean(touched.email && errors.email)}
                      />
                      {touched.email && errors.email && (
                        <Typography variant="body2" color="error">
                          {errors.email}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="phone_number"
                        value={values.phone_number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Phone Number"
                        error={Boolean(
                          touched.phone_number && errors.phone_number
                        )}
                      />
                      {touched.phone_number && errors.phone_number && (
                        <Typography variant="body2" color="error">
                          {errors.phone_number}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="address"
                        value={values.address}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Address"
                        error={Boolean(touched.address && errors.address)}
                      />
                      {touched.address && errors.address && (
                        <Typography variant="body2" color="error">
                          {errors.address}
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

export default EditSupplier;
