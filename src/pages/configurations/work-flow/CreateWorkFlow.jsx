import { useNavigate } from "react-router-dom";
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
  useCreateWorkFlowMutation,
  useGetWorkFlowsTemplateQuery,
} from "src/store/slices/configurations/workFlowApiSlice";
import MainCard from "src/components/MainCard";

const CreateWorkFlow = () => {
  const navigate = useNavigate();

  const { data: getTemplate } = useGetWorkFlowsTemplateQuery();
  const [createWorkFlow, { isLoading }] = useCreateWorkFlowMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Add Work Flow
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              flow_type: "",
              step: "",
              notify_to: [],
            }}
            validationSchema={Yup.object().shape({
              flow_type: Yup.string().required("Flow Type is required"),
              step: Yup.string().required("Step is required"),
              notify_to: Yup.array(),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                await createWorkFlow({
                  flow_type: values.flow_type,
                  step: values.step,
                  notify_to: values.notify_to.map((role) => role.id),
                }).unwrap();
                navigate(-1);
                enqueueSnackbar("Work Flow created successfully.", {
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
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.flow_type && errors.flow_type)}
                      >
                        <InputLabel id="flow_type-label">Flow Type</InputLabel>
                        <Select
                          labelId="flow_type-label"
                          id="flow_type"
                          variant="outlined"
                          name="flow_type"
                          value={values.flow_type || ""}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Flow Type"
                          error={Boolean(touched.flow_type && errors.flow_type)}
                          endAdornment={
                            values.flow_type && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChange({
                                    target: { name: "flow_type", value: "" },
                                  })
                                }
                              >
                                <ClearOutlined />
                              </IconButton>
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Select a flow type
                          </MenuItem>
                          {getTemplate?.flowTypeOptions &&
                            Object.keys(getTemplate.flowTypeOptions).map(
                              (key) => (
                                <MenuItem key={key} value={key}>
                                  {getTemplate.flowTypeOptions[key]}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                      {touched.flow_type && errors.flow_type && (
                        <Typography variant="body2" color="error">
                          {errors.flow_type}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.step && errors.step)}
                      >
                        <InputLabel id="step-label">Step</InputLabel>
                        <Select
                          labelId="step-label"
                          id="step"
                          variant="outlined"
                          name="step"
                          value={values.step || ""}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Step"
                          error={Boolean(touched.step && errors.step)}
                          endAdornment={
                            values.step && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChange({
                                    target: { name: "step", value: "" },
                                  })
                                }
                              >
                                <ClearOutlined />
                              </IconButton>
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Select a step
                          </MenuItem>
                          {getTemplate?.flowStepOptions &&
                            Object.keys(getTemplate.flowStepOptions).map(
                              (key) => (
                                <MenuItem key={key} value={key}>
                                  {getTemplate.flowStepOptions[key]}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                      {touched.step && errors.step && (
                        <Typography variant="body2" color="error">
                          {errors.step}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.notify_to && errors.notify_to)}
                      >
                        <Autocomplete
                          multiple
                          limitTags={2}
                          disableCloseOnSelect
                          id="notify_to"
                          options={getTemplate?.roleOptions || []}
                          value={values.notify_to}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "notify_to", value: newValue },
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
                              label="Notify To"
                              variant="outlined"
                              error={Boolean(
                                touched.notify_to && errors.notify_to
                              )}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.notify_to && errors.notify_to && (
                        <Typography variant="body2" color="error">
                          {errors.notify_to}
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

export default CreateWorkFlow;
