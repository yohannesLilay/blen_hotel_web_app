import { Grid, Stack, Typography } from "@mui/material";

import AuthLogin from "./auth-forms/AuthLogin";
import AuthWrapper from "./AuthWrapper";

const Login = () => {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack alignItems="center">
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
