import { useNavigate, useParams } from "react-router-dom";
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
  useUpdateRoomMutation,
  useGetRoomQuery,
  useGetRoomTemplateQuery,
} from "src/store/slices/configurations/roomApiSlice";
import MainCard from "src/components/MainCard";

const EditRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getRoom } = useGetRoomQuery(id);
  const { data: getTemplate } = useGetRoomTemplateQuery();
  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Room
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getRoom?.name || "",
              price: (getRoom?.price || "").toString().replace(/^\+251/, ""),
              notes: getRoom?.notes || "",
              room_type: getTemplate?.roomTypeOptions[getRoom?.room_type]
                ? getRoom?.room_type
                : "",
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              price: Yup.number().required("Price is required"),
              notes: Yup.string(),
              room_type: Yup.string().required("Room Type is required"),
            })}
            onSubmit={async (values) => {
              await updateRoom({
                id: parseInt(id),
                name: values.name,
                price: parseInt(values.price),
                room_type: values.room_type,
                notes: values.notes,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Room updated successfully.", {
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
                        name="price"
                        value={values.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Price"
                        type="number"
                        inputProps={{
                          pattern: "\\d*",
                          min: "1",
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
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.room_type && errors.room_type)}
                      >
                        <InputLabel id="room-type-label">Room Type</InputLabel>
                        <Select
                          labelId="room-type-label"
                          id="room_type"
                          variant="outlined"
                          name="room_type"
                          value={values.room_type || ""}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Room Type"
                          error={Boolean(touched.room_type && errors.room_type)}
                          endAdornment={
                            values.room_type && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChange({
                                    target: { name: "room_type", value: "" },
                                  })
                                }
                              >
                                <ClearOutlined />
                              </IconButton>
                            )
                          }
                        >
                          <MenuItem value="" disabled>
                            Select a room type
                          </MenuItem>
                          {getTemplate?.roomTypeOptions &&
                            Object.keys(getTemplate.roomTypeOptions).map(
                              (key) => (
                                <MenuItem key={key} value={key}>
                                  {getTemplate.roomTypeOptions[key]}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </FormControl>
                      {touched.room_type && errors.room_type && (
                        <Typography variant="body2" color="error">
                          {errors.room_type}
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

export default EditRoom;
