import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";
import MainCard from "src/components/MainCard";

const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: "100vh" }}>
    <Grid container direction="column" justifyContent="flex-end">
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: { xs: "calc(100vh - 134px)", md: "calc(100vh - 50px)" },
          }}
        >
          <Grid item>
            <MainCard
              sx={{
                maxWidth: { xs: 400, lg: 475 },
                margin: { xs: 2.5, md: 3 },
                "& > *": {
                  flexGrow: 1,
                  flexBasis: "50%",
                },
              }}
              content={false}
              border={false}
              boxShadow
            >
              <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthWrapper;
