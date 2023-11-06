import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  EditOutlined,
  PersonOutlineOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";

import MainCard from "src/components/MainCard";
import Transitions from "src/components/Transitions";
import ConfirmationModal from "src/components/modals/ConfirmationModal";
import { useLogoutMutation } from "src/store/slices/security/authApiSlice";
import { logout } from "src/store/slices/authSlice";

const Setting = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login");
      enqueueSnackbar(res.message, { variant: "success" });
      setShowConfirmationModal(false);
    } catch (err) {
      setShowConfirmationModal(false);
    }
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const [selectedIndex, setSelectedIndex] = useState();
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    if (index === 0) {
      navigate("/settings/profile");
    }
    if (index === 1) {
      navigate("/settings/change-password");
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = "grey.300";

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <ButtonBase
          sx={{
            p: 0.25,
            bgcolor: open ? iconBackColorOpen : "transparent",
            borderRadius: 1,
            "&:hover": { bgcolor: "secondary.lighter" },
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? "profile-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ p: 0.5 }}
          >
            <SettingsOutlined />
          </Stack>
        </ButtonBase>
        <Popper
          placement="bottom-end"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 9],
                },
              },
            ],
          }}
        >
          {({ TransitionProps }) => (
            <Transitions type="fade" in={open} {...TransitionProps}>
              {open && (
                <Paper
                  sx={{
                    boxShadow: theme.customShadows.z1,
                    width: 290,
                    minWidth: 170,
                    maxWidth: 200,
                    [theme.breakpoints.down("md")]: {
                      maxWidth: 250,
                    },
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard elevation={0} border={false} content={false}>
                      {open && (
                        <>
                          <List
                            component="nav"
                            sx={{
                              p: 0,
                              "& .MuiListItemIcon-root": {
                                minWidth: 22,
                                color: theme.palette.grey[500],
                              },
                            }}
                          >
                            <ListItemButton
                              selected={selectedIndex === 0}
                              onClick={() => handleListItemClick(event, 0)}
                            >
                              <ListItemIcon>
                                <PersonOutlineOutlined />
                              </ListItemIcon>
                              <ListItemText primary="View Profile" />
                            </ListItemButton>
                            <ListItemButton
                              selected={selectedIndex === 1}
                              onClick={() => handleListItemClick(event, 1)}
                            >
                              <ListItemIcon>
                                <EditOutlined />
                              </ListItemIcon>
                              <ListItemText primary="Change Password" />
                            </ListItemButton>
                            <ListItemButton
                              selected={selectedIndex === 2}
                              onClick={() => setShowConfirmationModal(true)}
                            >
                              <ListItemIcon>
                                <LogoutOutlined />
                              </ListItemIcon>
                              <ListItemText primary="Logout" />
                            </ListItemButton>
                          </List>
                        </>
                      )}
                    </MainCard>
                  </ClickAwayListener>
                </Paper>
              )}
            </Transitions>
          )}
        </Popper>
      </Box>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleLogout}
        dialogTitle="Confirm Logout"
        dialogContent="Are you sure you want to logout?"
        dialogActionName="Logout"
      />
    </>
  );
};

export default Setting;
