import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useUpdateRoleMutation,
  useGetRoleQuery,
  useGetRolesTemplateQuery,
} from "src/store/slices/security/roleApiSlice";
import MainCard from "src/components/MainCard";

const EditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetRolesTemplateQuery();
  const { data: getRole } = useGetRoleQuery(id);
  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Role
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getRole?.name || "",
              description: getRole?.description || "",
              permissions: (getRole?.permissions || []).map(
                (permission) =>
                  getTemplate?.permissionOptions.find(
                    (option) => option.code_name == permission.code_name
                  ) || {}
              ),
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              description: Yup.string(),
              permissions: Yup.array()
                .required("Permissions are required")
                .min(1, "At least one permission is required"),
            })}
            onSubmit={async (values) => {
              await updateRole({
                id: parseInt(id),
                name: values.name,
                description: values.description,
                permissions: values.permissions.map(
                  (permission) => permission.id
                ),
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Role updated successfully.", {
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
                          touched.permissions && errors.permissions
                        )}
                      >
                        <Autocomplete
                          multiple
                          limitTags={2}
                          disableCloseOnSelect
                          id="permissions"
                          options={getTemplate?.permissionOptions || []}
                          value={values.permissions}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "permissions", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.code_name}
                          renderOption={(props, option, state) => (
                            <li {...props}>
                              <Checkbox
                                checked={state.selected}
                                onChange={() => {}}
                              />
                              {option.code_name}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Permissions"
                              variant="outlined"
                              error={Boolean(
                                touched.permissions && errors.permissions
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.permissions && errors.permissions && (
                        <Typography variant="body2" color="error">
                          {errors.permissions}
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

export default EditRole;
