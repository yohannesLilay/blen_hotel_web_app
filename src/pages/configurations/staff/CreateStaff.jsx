import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
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
  useCreateStaffMutation,
  useGetStaffTemplateQuery,
} from "src/store/slices/configurations/staffApiSlice";
import MainCard from "src/components/MainCard";

const CreateStaff = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetStaffTemplateQuery();
  const [createStaff, { isLoading }] = useCreateStaffMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Add Staff
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: "",
              phone_number: "",
              staff_type: "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
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
              staff_type: Yup.string().required("Staff Type is required"),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                await createStaff({
                  name: values.name,
                  phone_number: "+251" + values.phone_number,
                  staff_type: values.staff_type,
                }).unwrap();
                navigate(-1);
                enqueueSnackbar("Staff created successfully.", {
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
                        error={Boolean(touched.staff_type && errors.staff_type)}
                      >
                        <InputLabel id="staff-type-label">
                          Staff Type
                        </InputLabel>
                        <Select
                          labelId="staff-type-label"
                          id="staff_type"
                          variant="outlined"
                          name="staff_type"
                          value={values.staff_type || ""}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Staff Type"
                          error={Boolean(
                            touched.staff_type && errors.staff_type
                          )}
                          endAdornment={
                            values.staff_type && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChange({
                                    target: { name: "staff_type", value: "" },
                                  })
                                }
                              >
                                <ClearOutlined />
                              </IconButton>
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Select a staff type
                          </MenuItem>
                          {getTemplate?.staffTypeOptions &&
                            Object.keys(getTemplate.staffTypeOptions).map(
                              (key) => (
                                <MenuItem key={key} value={key}>
                                  {getTemplate.staffTypeOptions[key]}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                      {touched.staff_type && errors.staff_type && (
                        <Typography variant="body2" color="error">
                          {errors.staff_type}
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

export default CreateStaff;
