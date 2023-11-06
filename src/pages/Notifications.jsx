import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "src/store/slices/notifications/notificationApiSlice";

const NotificationTableRow = ({ row }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{row.name}</TableCell>
      <TableCell align="left">{row.description}</TableCell>
    </TableRow>
  );
};

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const { data, isSuccess, refetch } = useGetNotificationsQuery({
    page,
    limit,
    exclude_read: showOnlyUnread,
  });
  const [updateNotification] = useUpdateNotificationMutation();

  const [rows, setRows] = useState(data?.notifications || []);
  const totalNotifications = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.Notifications || []);
  }, [isSuccess, data]);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit, exclude_read: showOnlyUnread });
  };

  const toggleUnreadFilter = () => {
    setShowOnlyUnread(!showOnlyUnread);
    if (showOnlyUnread) {
      refetch({ page: 1, limit, exclude_read: false });
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value;
    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit, exclude_read: showOnlyUnread });
  };

  const markAllNotificationsAsRead = async () => {
    const notificationIds = rows.reduce((ids, row) => {
      if (!row.read) {
        ids.push(parseInt(row.id));
      }
      return ids;
    }, []);
    await updateNotification({ notification_ids: notificationIds }).unwrap();

    const markedCount = notificationIds.length;
    const message = `${markedCount} notification${
      markedCount > 1 ? "s" : ""
    } marked as read.`;

    enqueueSnackbar(message, { variant: "success" });
  };

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
              onClick={markAllNotificationsAsRead}
            >
              <MailOutline /> Mark all as read
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Message</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <NotificationTableRow key={row.id} row={row} />
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

NotificationTableRow.propTypes = {
  row: PropTypes.object.isRequired,
};

export default Notifications;
