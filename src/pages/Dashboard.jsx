import { Grid, Typography } from "@mui/material";
import AnalyticEcommerce from "../components/statistics/AnalyticEcommerce";

import { useGetInfoReportQuery } from "src/store/slices/reports/reportApiSlice";

const Dashboard = () => {
  const { data } = useGetInfoReportQuery();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Categories"
          count={data?.categoryCount?.toString()}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Inventory Items"
          count={data?.productCount?.toString()}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Active Order"
          count={data?.activeOrderCount?.toString()}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Active Receivables"
          count={data?.activeReceivableCount?.toString()}
        />
      </Grid>

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />
    </Grid>
  );
};

export default Dashboard;
