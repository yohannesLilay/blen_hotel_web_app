import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik } from "formik";

import MainCard from "src/components/MainCard";
import { useChangePasswordMutation } from "src/store/slices/security/authApiSlice";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (passwordField) => {
    switch (passwordField) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object().shape({
              currentPassword: Yup.string().required(
                "Current Password is required"
              ),
              newPassword: Yup.string().required("New Password is required"),
              confirmPassword: Yup.string()
                .required("Confirm Password is required")
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                await changePassword({
                  current_password: values.currentPassword,
                  new_password: values.newPassword,
                  confirm_password: values.confirmPassword,
                }).unwrap();

                enqueueSnackbar("Password changed successfully.", {
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
                        type={showCurrentPassword ? "text" : "password"}
                        value={values.currentPassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="currentPassword"
                        label="Current Password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  handleClickShowPassword("currentPassword")
                                }
                                edge="end"
                                size="large"
                              >
                                {showCurrentPassword ? (
                                  <VisibilityOffOutlined />
                                ) : (
                                  <VisibilityOutlined />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(
                          touched.currentPassword && errors.currentPassword
                        )}
                      />
                      {touched.currentPassword && errors.currentPassword && (
                        <Typography variant="body2" color="error">
                          {errors.currentPassword}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        error={Boolean(
                          touched.newPassword && errors.newPassword
                        )}
                        type={showNewPassword ? "text" : "password"}
                        value={values.newPassword}
                        name="newPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  handleClickShowPassword("newPassword")
                                }
                                edge="end"
                                size="large"
                              >
                                {showNewPassword ? (
                                  <VisibilityOffOutlined />
                                ) : (
                                  <VisibilityOutlined />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        label="New Password"
                      />
                      {touched.newPassword && errors.newPassword && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-new-password"
                        >
                          {errors.newPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="confirmPassword"
                        label="Confirm Password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  handleClickShowPassword("confirmPassword")
                                }
                                edge="end"
                                size="large"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOffOutlined />
                                ) : (
                                  <VisibilityOutlined />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(
                          touched.confirmPassword && errors.confirmPassword
                        )}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Typography variant="body2" color="error">
                          {errors.confirmPassword}
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
                        onClick={() => navigate("/settings/profile")}
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
                        Change Password
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

export default ChangePassword;
