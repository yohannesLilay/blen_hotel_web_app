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

import {
  useUpdateProductMutation,
  useGetProductQuery,
  useGetProductTemplateQuery,
} from "src/store/slices/product-management/productApiSlice";
import MainCard from "src/components/MainCard";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetProductTemplateQuery();
  const { data: getProduct } = useGetProductQuery(id);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Product
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getProduct?.name || "",
              unit_of_measure: getProduct?.unit_of_measure || "",
              safety_stock_level: getProduct?.safety_stock_level || "",
              notes: getProduct?.notes || "",
              category:
                getTemplate?.categoryOptions.find(
                  (option) => option.id === getProduct?.category?.id
                ) || null,
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              unit_of_measure: Yup.string().required(
                "Unit of Measure is required"
              ),
              safety_stock_level: Yup.number(),
              notes: Yup.string(),
              category: Yup.object().shape({
                id: Yup.number().required("Category is required"),
              }),
            })}
            onSubmit={async (values) => {
              await updateProduct({
                id: parseInt(id),
                name: values.name,
                unit_of_measure: values.unit_of_measure,
                safety_stock_level: parseInt(values.safety_stock_level),
                notes: values.notes,
                categoryId: values.category?.id,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Product updated successfully.", {
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
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(
                          touched.unit_of_measure && errors.unit_of_measure
                        )}
                      >
                        <Autocomplete
                          disablePortal
                          id="unit_of_measure"
                          options={Object.values(getTemplate?.uomOptions || [])}
                          value={values.unit_of_measure || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: {
                                name: "unit_of_measure",
                                value: newValue,
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="UoM"
                              variant="outlined"
                              error={Boolean(
                                touched.unit_of_measure &&
                                  errors.unit_of_measure
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.unit_of_measure && errors.unit_of_measure && (
                        <Typography variant="body2" color="error">
                          {errors.unit_of_measure}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.category && errors.category)}
                      >
                        <Autocomplete
                          disablePortal
                          id="category"
                          options={getTemplate?.categoryOptions || []}
                          value={values.category || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "category", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Category"
                              variant="outlined"
                              error={Boolean(
                                touched.category && errors.category
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.category && errors.category && (
                        <Typography variant="body2" color="error">
                          {errors.category}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="safety_stock_level"
                        value={values.safety_stock_level}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Safety Stock Level"
                        error={Boolean(
                          touched.safety_stock_level &&
                            errors.safety_stock_level
                        )}
                      />
                      {touched.safety_stock_level &&
                        errors.safety_stock_level && (
                          <Typography variant="body2" color="error">
                            {errors.safety_stock_level}
                          </Typography>
                        )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="notes"
                        value={values.notes}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Notes"
                        error={Boolean(touched.notes && errors.notes)}
                      />
                      {touched.notes && errors.notes && (
                        <Typography variant="body2" color="error">
                          {errors.notes}
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

export default EditProduct;
