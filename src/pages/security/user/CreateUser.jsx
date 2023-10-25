import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormHelperText,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  VisibilityOffOutlined,
  VisibilityOutlined,
  ClearOutlined,
} from "@mui/icons-material";

import * as Yup from "yup";
import { Formik } from "formik";

import {
  useCreateUserMutation,
  useGetUsersTemplateQuery,
} from "src/store/slices/security/userApiSlice";
import MainCard from "src/components/MainCard";

const CreateUser = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { data: getTemplate } = useGetUsersTemplateQuery();
  const [createUser, { isLoading }] = useCreateUserMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Add User
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              gender: "",
              phone_number: "",
              roles: [],
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Full Name is required"),
              email: Yup.string()
                .email("Must be a valid email")
                .required("Email is required"),
              password: Yup.string().required("Password is required"),
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
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                await createUser({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                  gender: values.gender,
                  phone_number: "+251" + values.phone_number,
                  roles: values.roles.map((role) => role.id),
                }).unwrap();
                navigate(-1);
                enqueueSnackbar("User created successfully.", {
                  variant: "success",
                });

                setStatus({ success: false });
                setSubmitting(false);
              } catch (err) {
                setStatus({ success: false });
                setSubmitting(false);
              }
            }}
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
                        error={Boolean(touched.password && errors.password)}
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                              >
                                {showPassword ? (
                                  <VisibilityOffOutlined />
                                ) : (
                                  <VisibilityOutlined />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        label="Password"
                      />
                      {touched.password && errors.password && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-password-login"
                        >
                          {errors.password}
                        </FormHelperText>
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
                      {touched.roles && errors.roles && (
                        <Typography variant="body2" color="error">
                          {errors.roles}
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

export default CreateUser;
