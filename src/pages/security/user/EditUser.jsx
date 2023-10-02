import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ClearOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useUpdateUserMutation,
  useGetUserQuery,
  useGetUsersTemplateQuery,
} from "src/store/slices/security/userApiSlice";
import MainCard from "src/components/MainCard";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetUsersTemplateQuery();
  const { data: getUser } = useGetUserQuery(id);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit User
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getUser?.name || "",
              email: getUser?.email || "",
              gender: getUser?.gender || "",
              phone_number: (getUser?.phone_number || "").replace(/^\+251/, ""),
              roles: (getUser?.roles || []).map(
                (role) =>
                  getTemplate?.roleOptions.find(
                    (option) => option.name == role.name
                  ) || {}
              ),
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Full Name is required"),
              email: Yup.string()
                .email("Must be a valid email")
                .required("Email is required"),
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
              gender: Yup.string().required("Gender is required"),
              roles: Yup.array()
                .required("Roles are required")
                .min(1, "At least one role is required"),
            })}
            onSubmit={async (values) => {
              await updateUser({
                id: parseInt(id),
                name: values.name,
                email: values.email,
                gender: values.gender,
                phone_number: "+251" + values.phone_number,
                roles: values.roles.map((role) => role.id),
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("User updated successfully.", {
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
                        label="Full Name"
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
                        type="email"
                        name="email"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Email Address"
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
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.gender && errors.gender)}
                      >
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          id="gender"
                          variant="outlined"
                          name="gender"
                          value={values.gender || ""}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Gender"
                          error={Boolean(touched.gender && errors.gender)}
                          endAdornment={
                            values.gender && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChange({
                                    target: { name: "gender", value: "" },
                                  })
                                }
                              >
                                <ClearOutlined />
                              </IconButton>
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Select a gender
                          </MenuItem>
                          {getTemplate?.genderOptions &&
                            Object.keys(getTemplate.genderOptions).map(
                              (key) => (
                                <MenuItem key={key} value={key}>
                                  {getTemplate.genderOptions[key]}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                      {touched.gender && errors.gender && (
                        <Typography variant="body2" color="error">
                          {errors.gender}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.roles && errors.roles)}
                      >
                        <Autocomplete
                          multiple
                          limitTags={2}
                          disableCloseOnSelect
                          id="roles"
                          options={getTemplate?.roleOptions || []}
                          value={values.roles}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "roles", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option, state) => (
                            <li {...props}>
                              <Checkbox
                                checked={state.selected}
                                onChange={() => {}}
                              />
                              {option.name}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Roles"
                              variant="outlined"
                              error={Boolean(touched.roles && errors.roles)}
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

export default EditUser;
