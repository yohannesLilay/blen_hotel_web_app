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
  useUpdateInventoryMutation,
  useGetInventoryQuery,
  useGetInventoryTemplateQuery,
} from "src/store/slices/configurations/subCategoryApiSlice";
import MainCard from "src/components/MainCard";

const EditInventory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetInventoryTemplateQuery();
  const { data: getInventory } = useGetInventoryQuery(id);
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Inventory
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getInventory?.name || "",
              description: getInventory?.description || "",
              category:
                getTemplate?.categoryOptions.find(
                  (option) => option.id === getInventory?.category?.id
                ) || null,
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              description: Yup.string(),
              category: Yup.object().shape({
                id: Yup.number().required("Category is required"),
              }),
            })}
            onSubmit={async (values) => {
              await updateInventory({
                id: parseInt(id),
                name: values.name,
                description: values.description,
                categoryId: values.category?.id,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Inventory updated successfully.", {
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
                        name="description"
                        value={values.description}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Description"
                        error={Boolean(
                          touched.description && errors.description
                        )}
                      />
                      {touched.description && errors.description && (
                        <Typography variant="body2" color="error">
                          {errors.description}
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

export default EditInventory;
