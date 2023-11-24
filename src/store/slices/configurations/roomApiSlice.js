import { apiSlice } from "../apiSlice"
const ROOM_ENDPOINT = "rooms";

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => ({ url: ROOM_ENDPOINT }),
    }),
    getRoomTemplate: builder.query({
        query: () => ({
          url: `${ROOM_ENDPOINT}/template`,
        }),
      }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOM_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getRoom: builder.query({
      query: (id) => ({
        url: `${ROOM_ENDPOINT}/${id}`,
      }),
    }),
    updateRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOM_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    toggleRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOM_ENDPOINT}/${data.id}/toggle-status`,
        method: "PATCH",
      }),
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `${ROOM_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomTemplateQuery,
  useCreateRoomMutation,
  useGetRoomQuery,
  useUpdateRoomMutation,
  useToggleRoomMutation,
  useDeleteRoomMutation,
} = roomsApiSlice;
