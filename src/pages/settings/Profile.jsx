import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import MainCard from "src/components/MainCard";
import { useGetUserProfileQuery } from "src/store/slices/security/userApiSlice";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

const Profile = () => {
  const navigate = useNavigate();
  const { data: getUserProfile } = useGetUserProfileQuery();

  return (
    <Grid item xs={12} md={5} lg={4}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Account Profile</Typography>
        </Grid>
        <Grid item />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
            "& .MuiListItemButton-root": {
              py: 1.5,
              "& .MuiAvatar-root": avatarSX,
              "& .MuiListItemSecondaryAction-root": {
                ...actionSX,
                position: "relative",
              },
            },
          }}
        >
          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1">Full Name</Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.name}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1">Email</Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.email}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={
                <Typography variant="subtitle1">Phone Number</Typography>
              }
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.phone_number}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1">Gender</Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.gender}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1">Roles</Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.roles.map((role) => role.name).join(", ")}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1">Status</Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Typography variant="h6" color="secondary" noWrap>
                  {getUserProfile?.status ? "Active" : "Inactive"}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>

          <ListItemButton divider>
            <ListItemText
              primary={<Typography variant="subtitle1"></Typography>}
            />
            <ListItemSecondaryAction>
              <Stack alignItems="flex-end">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate("/settings/change-password")}
                >
                  Change Password
                </Button>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>
        </List>
      </MainCard>
    </Grid>
  );
};

export default Profile;
