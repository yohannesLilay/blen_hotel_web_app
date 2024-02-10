import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Formik } from "formik";
import * as Yup from "yup";
import { enqueueSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import MainCard from "src/components/MainCard";
import { useGetRoomRevenueReportMutation } from "src/store/slices/reports/reportApiSlice";
import { SettingsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function RoomRevenueReport() {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [generateReport, { isLoading }] = useGetRoomRevenueReportMutation();

  const [rows, setRows] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [timePeriod, setTimePeriod] = useState(null);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Room Revenue Report
      </Typography>

      {isCollapsed == false && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <MainCard sx={{ mt: 2 }} content={false}>
              <Box sx={{ p: 2 }}>
                <Formik
                  initialValues={{
                    start_date: null,
                    end_date: null,
                  }}
                  validationSchema={Yup.object().shape({
                    start_date: Yup.date()
                      .required("Start Date is required")
                      .max(new Date(), "Start Date cannot be in the future")
                      .test(
                        "start-date-before-end",
                        "Start Date must be before End Date",
                        function (start_date) {
                          const end_date = this.parent.end_date;
                          return !end_date || start_date <= end_date;
                        }
                      ),
                    end_date: Yup.date()
                      .required("End Date is required")
                      .max(new Date(), "End Date cannot be in the future"),
                  })}
                  onSubmit={async (values, { setStatus, setSubmitting }) => {
                    try {
                      if (values.start_date > values.end_date) {
                        enqueueSnackbar(
                          "Please make sure the start date is lower than the end date.",
                          { variant: "error" }
                        );
                      } else {
                        const response = await generateReport({
                          start_date: new Date(values.start_date),
                          end_date: new Date(values.end_date),
                        }).unwrap();

                        setRows(response?.detail || []);
                        setTotalRevenue(response?.total || null);
                        setTimePeriod(response?.timePeriod || null);

                        setIsCollapsed(true);
                        setStatus({ success: false });
                        setSubmitting(false);
                      }
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
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Start Date"
                                variant="outlined"
                                format="DD-MM-YYYY"
                                maxDate={dayjs()}
                                disableFuture
                                value={values.start_date}
                                name="start_date"
                                id="start_date"
                                onBlur={handleBlur}
                                onChange={(date) => {
                                  handleChange({
                                    target: { name: "start_date", value: date },
                                  });
                                }}
                                error={Boolean(
                                  touched.start_date && errors.start_date
                                )}
                                textField={(props) => (
                                  <TextField
                                    {...props}
                                    error={Boolean(
                                      touched.start_date && errors.start_date
                                    )}
                                    helperText={
                                      touched.start_date && errors.start_date
                                    }
                                    label="Start Date"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            {touched.start_date && errors.start_date && (
                              <Typography variant="body2" color="error">
                                {errors.start_date}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="End Date"
                                variant="outlined"
                                format="DD-MM-YYYY"
                                maxDate={dayjs()}
                                disableFuture
                                value={values.end_date}
                                name="end_date"
                                id="end_date"
                                onBlur={handleBlur}
                                onChange={(date) => {
                                  handleChange({
                                    target: { name: "end_date", value: date },
                                  });
                                }}
                                error={Boolean(
                                  touched.end_date && errors.end_date
                                )}
                                textField={(props) => (
                                  <TextField
                                    {...props}
                                    error={Boolean(
                                      touched.end_date && errors.end_date
                                    )}
                                    helperText={
                                      touched.end_date && errors.end_date
                                    }
                                    label="End Date"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            {touched.end_date && errors.end_date && (
                              <Typography variant="body2" color="error">
                                {errors.end_date}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          container
                          justifyContent="center"
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
                              variant="contained"
                              color="primary"
                              type="submit"
                              disabled={isSubmitting || isLoading}
                              startIcon={<SettingsOutlined />}
                            >
                              Generate
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
        </Grid>
      )}

      {isCollapsed && (
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box
            sx={{ pr: 1, display: "flex", justifyContent: "flex-end", mt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCollapsed(false)}
            >
              Parameters
            </Button>
          </Box>

          <Box sx={{ pl: 1, my: 1 }}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Box mb={1}>
                  <span style={{ fontWeight: "bold" }}>Time Period:</span>{" "}
                  {dayjs(timePeriod.startDate).format("YYYY-MM-DD")} -{" "}
                  {dayjs(timePeriod.endDate).format("YYYY-MM-DD")}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <span style={{ fontWeight: "bold" }}>Total Revenue:</span>{" "}
                  <NumericFormat
                    value={totalRevenue}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 1 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ paddingLeft: "20px" }}>Date</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell># Rooms Occupied</TableCell>
                    <TableCell># Rooms Free</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">
                          No data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell style={{ paddingLeft: "20px" }}>
                        {dayjs(row.date).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        <NumericFormat
                          value={row.revenue}
                          displayType="text"
                          thousandSeparator={true}
                          decimalScale={2}
                          fixedDecimalScale={true}
                        />
                      </TableCell>
                      <TableCell>{row.roomsOccupied}</TableCell>
                      <TableCell>{row.roomsFree}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      )}
    </div>
  );
}

export default RoomRevenueReport;
