import PropTypes from "prop-types";

import { Chip, Grid, Stack, Typography } from "@mui/material";
import { TrendingUpOutlined, TrendingDownOutlined } from "@mui/icons-material";
import MainCard from "src/components/MainCard";

const AnalyticEcommerce = ({ color, title, count, percentage, isLoss }) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
        </Grid>
        {percentage && (
          <Grid item>
            <Chip
              variant="combined"
              color={color}
              icon={
                <>
                  {!isLoss && (
                    <TrendingUpOutlined
                      style={{ fontSize: "0.75rem", color: "inherit" }}
                    />
                  )}
                  {isLoss && (
                    <TrendingDownOutlined
                      style={{ fontSize: "0.75rem", color: "inherit" }}
                    />
                  )}
                </>
              }
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  </MainCard>
);

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

AnalyticEcommerce.defaultProps = {
  color: "primary",
};

export default AnalyticEcommerce;
