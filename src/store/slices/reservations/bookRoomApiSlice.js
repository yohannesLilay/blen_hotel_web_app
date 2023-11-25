import { apiSlice } from "../apiSlice"
const BOOK_ROOM_ENDPOINT = "book-rooms";

export const bookRoomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookRooms: builder.query({
      query: ({page, limit, date }) => ({
        url: BOOK_ROOM_ENDPOINT,
        params: { page, limit, date },
      }),
    }),
    getBookRoomTemplate: builder.query({
        query: ({room_type}) => ({
          url: `${BOOK_ROOM_ENDPOINT}/template`,
          params: { room_type}
        }),
      }),
    createBookRoom: builder.mutation({
      query: (data) => ({
        url: `${BOOK_ROOM_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getBookRoom: builder.query({
      query: (id) => ({
        url: `${BOOK_ROOM_ENDPOINT}/${id}`,
      }),
    }),
    updateBookRoom: builder.mutation({
      query: (data) => ({
        url: `${BOOK_ROOM_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    freeBookRoom: builder.mutation({
      query: (data) => ({
        url: `${BOOK_ROOM_ENDPOINT}/${data.id}/free-room`,
        method: "PATCH",
      }),
    }),
    deleteBookRoom: builder.mutation({
      query: (id) => ({
        url: `${BOOK_ROOM_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBookRoomsQuery,
  useGetBookRoomTemplateQuery,
  useCreateBookRoomMutation,
  useGetBookRoomQuery,
  useUpdateBookRoomMutation,
  useFreeBookRoomMutation,
  useDeleteBookRoomMutation,
} = bookRoomsApiSlice;
