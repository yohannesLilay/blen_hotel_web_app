import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Grid, TextField, Stack, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useUpdateMenuMutation,
  useGetMenuQuery,
} from "src/store/slices/configurations/menuApiSlice";
import MainCard from "src/components/MainCard";

const EditMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getMenu } = useGetMenuQuery(id);
  const [updateMenu, { isLoading }] = useUpdateMenuMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Menu
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              item: getMenu?.item || "",
              item_local_name: getMenu?.item_local_name || "",
              price: getMenu?.price || "",
              description: getMenu?.description || "",
            }}
            validationSchema={Yup.object().shape({
              item: Yup.string().required("Item is required"),
              item_local_name: Yup.string(),
              price: Yup.number().required("Price is required"),
              description: Yup.string(),
            })}
            onSubmit={async (values) => {
              await updateMenu({
                id: parseInt(id),
                item: values.item,
                item_local_name: values.item_local_name,
                price: parseFloat(values.price),
                description: values.description,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Menu updated successfully.", {
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
                        name="item"
                        value={values.item}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Item"
                        error={Boolean(touched.item && errors.item)}
                      />
                      {touched.item && errors.item && (
                        <Typography variant="body2" color="error">
                          {errors.item}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="item_local_name"
                        value={values.item_local_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Item Local Name"
                        error={Boolean(
                          touched.item_local_name && errors.item_local_name
                        )}
                      />
                      {touched.item_local_name && errors.item_local_name && (
                        <Typography variant="body2" color="error">
                          {errors.item_local_name}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="price"
                        value={values.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Price"
                        type="number"
                        inputProps={{
                          step: "0.01",
                          min: "0",
                        }}
                        error={Boolean(touched.price && errors.price)}
                      />
                      {touched.price && errors.price && (
                        <Typography variant="body2" color="error">
                          {errors.price}
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

export default EditMenu;
