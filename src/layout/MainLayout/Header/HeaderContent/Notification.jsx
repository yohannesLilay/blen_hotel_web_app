import { useRef, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { NotificationsNoneOutlined, CloseOutlined } from "@mui/icons-material";
import io from "socket.io-client";
import { enqueueSnackbar } from "notistack";

import MainCard from "src/components/MainCard";
import Transitions from "src/components/Transitions";
import {
  setNotificationCount,
  incrementNotificationCount,
} from "src/store/slices/notifications/notificationSlice";
import { useGetNotificationsQuery } from "src/store/slices/notifications/notificationApiSlice";

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",

  transform: "none",
};

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const notificationCount = useSelector(
    (state) => state.notifications.notificationCount
  );

  useEffect(() => {
    const userId = userInfo ? userInfo.userId : null;

    const shouldUseWebSocket = import.meta.env.VITE_USE_WEBSOCKET === "true";

    if (shouldUseWebSocket) {
      const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
        query: { userId: userId },
      });

      socket.on("connect", () => {
        socket.emit("joinRoom", String(userId));
      });

      socket.on("notification", (data) => {
        if (data) {
          dispatch(incrementNotificationCount());
          enqueueSnackbar("You have new notification.", { variant: "info" });
        }
      });

      return () => {
        socket.disconnect();
      };
    } else return undefined;
  }, [dispatch, userInfo]);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const { data, isSuccess, refetch } = useGetNotificationsQuery({
    page: 1,
    limit: 5,
    exclude_read: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setRows(data?.notifications || []);
      dispatch(setNotificationCount(data?.total || 0));
    }
  }, [isSuccess, data, dispatch]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    if (!open) {
      refetch({ page: 1, limit: 5, exclude_read: true });
      dispatch(setNotificationCount(data?.total || 0));
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = "grey.300";
  const iconBackColor = "grey.100";

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{
          color: "text.primary",
          bgcolor: open ? iconBackColorOpen : iconBackColor,
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notificationCount} color="primary">
          <NotificationsNoneOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
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
                offset: [matchesXs ? -5 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down("md")]: {
                  maxWidth: 285,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                  headerSX={{
                    "&.MuiCardHeader-root": {
                      padding: "12px !important",
                    },
                  }}
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      "& .MuiListItemButton-root": {
                        py: 0.5,
                        "& .MuiAvatar-root": avatarSX,
                        "& .MuiListItemSecondaryAction-root": {
                          ...actionSX,
                          position: "relative",
                        },
                      },
                    }}
                  >
                    {rows.map((notification, index) => (
                      <div key={index}>
                        <ListItemButton
                          onClick={() => {
                            setOpen((prevOpen) => !prevOpen);
                            navigate("/notifications");
                          }}
                        >
                          {notification.read ? (
                            <ListItemText
                              primary={
                                <Typography variant="h6">
                                  {notification.message}
                                </Typography>
                              }
                            />
                          ) : (
                            <Typography component="span" variant="subtitle1">
                              {notification.message}
                            </Typography>
                          )}
                        </ListItemButton>
                        {index !== rows.length - 1 && <Divider />}
                      </div>
                    ))}
                    <ListItemButton
                      sx={{ textAlign: "center", py: `${12}px !important` }}
                      onClick={() => {
                        setOpen((prevOpen) => !prevOpen);
                        navigate("/notifications");
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            View All
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
