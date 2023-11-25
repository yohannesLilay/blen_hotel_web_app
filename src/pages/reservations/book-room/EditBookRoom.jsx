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
  useUpdateBookRoomMutation,
  useGetBookRoomQuery,
  useGetBookRoomTemplateQuery,
} from "src/store/slices/reservations/bookRoomApiSlice";
import MainCard from "src/components/MainCard";

const EditBookRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: getTemplate } = useGetBookRoomTemplateQuery();
  const { data: getBookRoom } = useGetBookRoomQuery(id);
  const [updateBookRoom, { isLoading }] = useUpdateBookRoomMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Edit Booked Room
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              name: getBookRoom?.name || "",
              unit_of_measure: getBookRoom?.unit_of_measure || "",
              safety_stock_level: getBookRoom?.safety_stock_level || "",
              notes: getBookRoom?.notes || "",
              room:
                getTemplate?.roomOptions.find(
                  (option) => option.id === getBookRoom?.room?.id
                ) || null,
            }}
            validationSchema={Yup.object().shape({
              notes: Yup.string(),
              room: Yup.object().shape({
                id: Yup.number().required("Room is required"),
              }),
            })}
            onSubmit={async (values) => {
              await updateBookRoom({
                id: parseInt(id),
                notes: values.notes,
                room_id: values.room?.id,
              }).unwrap();
              navigate(-1);
              enqueueSnackbar("Book Room updated successfully.", {
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
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={Boolean(touched.room && errors.room)}
                      >
                        <Autocomplete
                          id="room"
                          options={getTemplate?.roomOptions || []}
                          value={values.room || null}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: { name: "room", value: newValue },
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Room"
                              variant="outlined"
                              error={Boolean(touched.room && errors.room)}
                            />
                          )}
                        />
                      </FormControl>
                      {touched.room && errors.room && (
                        <Typography variant="body2" color="error">
                          {errors.room}
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

export default EditBookRoom;
