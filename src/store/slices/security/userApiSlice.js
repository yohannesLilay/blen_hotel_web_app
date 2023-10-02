import { apiSlice } from "../apiSlice";
const USERS_ENDPOINT = "users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_ENDPOINT,
      }),
    }),
    getUsersTemplate: builder.query({
      query: () => ({
        url: `${USERS_ENDPOINT}/template`,
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `${USERS_ENDPOINT}/${id}`,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    toggleUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_ENDPOINT}/${data.id}/toggle-status`,
        method: "PATCH",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersTemplateQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useToggleUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
