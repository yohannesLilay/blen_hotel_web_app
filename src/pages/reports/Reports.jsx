import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import MainCard from "src/components/MainCard";
import PermissionGuard from "src/components/PermissionGuard";

function Reports() {
  const navigate = useNavigate();

  const data = [
    // {
    //   id: 1,
    //   name: "Inventory Level Report",
    //   description: "Provides the current status of items held in stock ",
    // },
    {
      id: 1,
      name: "Product Sales Report",
      description:
        "Offers a detailed overview of individual product sales within a specified time frame.",
      route: "product-sales-report",
      permission: "view_product_sales_reports",
    },
    {
      id: 2,
      name: "Reorder Status Report",
      description: "Inventory items at or below predetermined reorder points.",
      route: "reorder-status-report",
      permission: "view_reorder_status_report",
    },
    {
      id: 3,
      name: "Daily/Weekly/Monthly Sales Report",
      description:
        "Provides a summary of sales activities over specific time periods",
      route: "menu-sales-report",
      permission: "view_periodic_sales_report",
    },
    {
      id: 4,
      name: "Sales by Staff Report",
      description:
        "Offers insights into the sales performance of individual staff members within a specified time frame.",
      route: "sales-by-staff-report",
      permission: "view_sales_by_staff_report",
    },
    {
      id: 5,
      name: "Room Revenue Report",
      description:
        "Summarizes revenue from room rentals and related services in a specified period",
      route: "room-revenue-report",
      permission: "view_room_revenue_report",
    },
  ];

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Reports</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <PermissionGuard key={row.id} permission={row.permission}>
                      <TableRow>
                        <TableCell style={{ width: 5 }}></TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => navigate(`./${row.route}`)}
                          >
                            Run
                          </Button>
                        </TableCell>
                      </TableRow>
                    </PermissionGuard>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      </Grid>
    </>
  );
}

export default Reports;
