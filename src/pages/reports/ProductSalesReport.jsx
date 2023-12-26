import { useState, useEffect } from "react";
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import MainCard from "src/components/MainCard";

function ProductSalesReport() {
  const [selectedStartDate, handleStartDateChange] = useState(null);
  const [selectedEndDate, handleEndDateChange] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Example data for the table
  const allData = [
    { id: 1, productName: "Product A", sales: 100, date: "2023-01-01" },
    { id: 2, productName: "Product B", sales: 150, date: "2023-02-01" },
    { id: 3, productName: "Product C", sales: 200, date: "2023-03-01" },
    // Add more rows as needed
  ];

  useEffect(() => {
    // Filter data based on selected date range
    const filtered = allData.filter((data) => {
      const currentDate = dayjs(data.date);
      return (
        (!selectedStartDate || currentDate.isSameOrAfter(selectedStartDate)) &&
        (!selectedEndDate || currentDate.isSameOrBefore(selectedEndDate))
      );
    });

    setFilteredData(filtered);
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Product Sales Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <MainCard sx={{ mt: 2 }} content={false}>
        <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
          <TableContainer component={Paper} style={{ marginTop: 16 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Sales</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.sales}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainCard>
    </div>
  );
}

export default ProductSalesReport;
