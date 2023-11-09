import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";
import {
  FilterListOffOutlined,
  FilterListOutlined,
  MailOutline,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import MainCard from "src/components/MainCard";
import { setNotificationCount } from "src/store/slices/notifications/notificationSlice";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useUpdateNotificationMutation,
} from "src/store/slices/notifications/notificationApiSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const { data, isSuccess, refetch } = useGetNotificationsQuery({
    page,
    limit,
    exclude_read: showOnlyUnread,
  });
  const [updateNotification] = useUpdateNotificationMutation();
  const { data: notificationCount, refetch: countRefetch } =
    useGetUnreadNotificationsCountQuery();

  const [rows, setRows] = useState(data?.notifications || []);
  const totalNotifications = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.notifications || []);
    dispatch(setNotificationCount(notificationCount || 0));
  }, [isSuccess, data, notificationCount, dispatch]);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit, exclude_read: showOnlyUnread });
  };

  const toggleUnreadFilter = () => {
    setShowOnlyUnread(!showOnlyUnread);
    refetch({ page: 1, limit, exclude_read: !showOnlyUnread });
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value;
    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit, exclude_read: showOnlyUnread });
  };

  const markNotificationsAsRead = async (notificationIds) => {
    if (notificationIds.length === 0) {
      return;
    }

    await updateNotification({ notification_ids: notificationIds }).unwrap();

    await countRefetch();
    dispatch(setNotificationCount(notificationCount || 0));
    await refetch({ page, limit, exclude_read: showOnlyUnread });

    setSelected([]);

    const markedCount = notificationIds.length;
    const message = `${markedCount} notification${
      markedCount > 1 ? "s" : ""
    } marked as read.`;

    enqueueSnackbar(message, { variant: "success" });
  };

  const markAllNotificationsAsRead = async () => {
    const unreadNotificationIds = rows
      .filter((row) => !row.read)
      .map((row) => parseInt(row.id));

    markNotificationsAsRead(unreadNotificationIds);
  };

  const markSelectedNotificationsAsRead = async () => {
    markNotificationsAsRead(selected);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Notifications</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleUnreadFilter}
              style={{ marginRight: "10px" }}
            >
              {showOnlyUnread ? (
                <>
                  <FilterListOffOutlined /> Show All
                </>
              ) : (
                <>
                  <FilterListOutlined /> Show Unread
                </>
              )}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                selected.length > 0
                  ? markSelectedNotificationsAsRead
                  : markAllNotificationsAsRead
              }
            >
              <MailOutline />{" "}
              {selected.length > 0 ? "Mark as read" : "Mark all as read"}
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "& td, th": {
                          paddingTop: "16px !important",
                          paddingBottom: "16px !important",
                          paddingLeft: "5px !important",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(row.id)}
                          onChange={(event) => handleClick(event, row.id)}
                        />
                      </TableCell>
                      <TableCell align="left">
                        {row.read ? (
                          row.message
                        ) : (
                          <Typography variant="subtitle1">
                            {row.message}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalNotifications}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </MainCard>
      </Grid>
    </>
  );
};

export default Notifications;
