import { Box, Stack, Grid } from "@mui/material";

import Logo from "src/components/Logo";
import Notification from "./Notification";
import Setting from "./Setting";

const Profile = () => {
  return (
    <>
      <Box
        sx={{ width: "100%", ml: 1, display: { xs: "none", md: "block" } }}
      />

      {/* Logo for Small Devices */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          display: { xs: "flex", md: "none" },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Logo />
        </Stack>
      </Grid>

      <Notification />
      <Setting />
    </>
  );
};

export default Profile;
