import { apiSlice } from "../apiSlice"
const NOTIFICATION_ENDPOINT = "notifications";

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({page, limit, exclude_read }) => ({
        url: NOTIFICATION_ENDPOINT,
        params: { page, limit, exclude_read },
      }),
    }),
    updateNotification: builder.mutation({
      query: (data) => ({
        url: `${NOTIFICATION_ENDPOINT}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationMutation
} = notificationsApiSlice;
