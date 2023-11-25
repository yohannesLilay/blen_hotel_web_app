import { useNavigate, useLocation } from "react-router-dom";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  useCreateBookRoomMutation,
  useGetBookRoomTemplateQuery,
} from "src/store/slices/reservations/bookRoomApiSlice";
import MainCard from "src/components/MainCard";

const CreateBookRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("param");
  const room_type = paramValue === "bed" ? "BED" : "MEETING HALL";

  const { data: getTemplate } = useGetBookRoomTemplateQuery({ room_type });
  const [createBookRoom, { isLoading }] = useCreateBookRoomMutation();

  return (
    <Grid item xs={12} md={7} lg={8}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Book a {paramValue === "bed" ? "Bed" : "Meeting Hall"} Room
          </Typography>
        </Grid>
        <Grid item />
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ p: 2 }}>
          <Formik
            initialValues={{
              room: null,
              notes: "",
              book_date: dayjs(),
            }}
            validationSchema={Yup.object().shape({
              book_date: Yup.date()
                .required("Book Date is required")
                .max(new Date(), "Book Date cannot be in the future"),
              notes: Yup.string(),
              room: Yup.object().shape({
                id: Yup.number().required("Room is required"),
              }),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              try {
                await createBookRoom({
                  book_date: new Date(values.book_date),
                  room_id: values.room?.id,
                  notes: values.notes,
                }).unwrap();
                navigate(-1);
                enqueueSnackbar("Room Booked successfully.", {
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Book Date"
                          variant="outlined"
                          format="DD-MM-YYYY"
                          maxDate={dayjs()}
                          disableFuture
                          value={values.book_date}
                          name="book_date"
                          id="book_date"
                          onBlur={handleBlur}
                          onChange={(date) => {
                            handleChange({
                              target: { name: "book_date", value: date },
                            });
                          }}
                          error={Boolean(touched.book_date && errors.book_date)}
                          textField={(props) => (
                            <TextField
                              {...props}
                              error={Boolean(
                                touched.book_date && errors.book_date
                              )}
                              helperText={touched.book_date && errors.book_date}
                              label="Book Date"
                              fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                      {touched.book_date && errors.book_date && (
                        <Typography variant="body2" color="error">
                          {errors.book_date}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
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

export default CreateBookRoom;
