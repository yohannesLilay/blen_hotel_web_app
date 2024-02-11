import { Grid, Typography } from "@mui/material";
import AnalyticEcommerce from "../components/statistics/AnalyticEcommerce";
import {
  useGetInfoReportQuery,
  useGetTopUsedMenusReportQuery,
  useGetTopIncomeMenusReportQuery,
} from "src/store/slices/reports/reportApiSlice";
import BarChartComponent from "../components/charts/BarChart";

const Dashboard = () => {
  const { data } = useGetInfoReportQuery();
  const { data: topUsedMenus, isSuccess: topUsedSuccess } =
    useGetTopUsedMenusReportQuery();
  const { data: topIncomeMenus, isSuccess: topIncomeSuccess } =
    useGetTopIncomeMenusReportQuery();

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

      {topUsedSuccess &&
        topUsedMenus &&
        Array.isArray(topUsedMenus) &&
        topUsedMenus.length > 0 && (
          <Grid item xs={12} sm={6}>
            <BarChartComponent
              dataset={topUsedMenus}
              title="Top 5 Used Products"
            />
          </Grid>
        )}

      {topIncomeSuccess &&
        topIncomeMenus &&
        Array.isArray(topIncomeMenus) &&
        topIncomeMenus.length > 0 && (
          <Grid item xs={12} sm={6}>
            <BarChartComponent
              dataset={topIncomeMenus}
              title="Top 5 Income Products"
            />
          </Grid>
        )}

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />
    </Grid>
  );
};

export default Dashboard;
