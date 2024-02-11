import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import MainCard from "src/components/MainCard";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const chartSetting = {
  yAxis: [
    {
      label: "amount",
    },
  ],
  height: 350,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

const valueFormatter = (value) => `${value}`;

const BarChartComponent = ({ dataset, title }) => {
  const parsedDataset =
    dataset && Array.isArray(dataset) && dataset.length > 0
      ? dataset.map((item) => ({
          ...item,
          usageCount: Number(item.usageCount),
          totalPrice: Number(item.totalPrice),
        }))
      : [];

  return (
    <>
      <MainCard sx={{ mt: 1 }} content={false}>
        <Typography variant="h5" mt={2} ml={2}>
          {title}
        </Typography>

        <BarChart
          dataset={parsedDataset}
          xAxis={[{ scaleType: "band", dataKey: "menuName" }]}
          series={[
            { dataKey: "usageCount", label: "Usage", valueFormatter },
            { dataKey: "totalPrice", label: "Total Price", valueFormatter },
          ]}
          {...chartSetting}
          margin={{ top: 30, bottom: 50, left: 65, right: 10 }}
        />
      </MainCard>
    </>
  );
};

BarChartComponent.propTypes = {
  dataset: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default BarChartComponent;
