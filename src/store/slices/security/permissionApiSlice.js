import { apiSlice } from "../apiSlice"
const PERMISSION_ENDPOINT = "permissions";

export const permissionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => ({
        url: PERMISSION_ENDPOINT,
      }),
    }),
    createPermission: builder.mutation({
      query: (data) => ({
        url: `${PERMISSION_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getPermission: builder.query({
      query: (id) => ({
        url: `${PERMISSION_ENDPOINT}/${id}`,
      }),
    }),
    updatePermission: builder.mutation({
      query: (data) => ({
        url: `${PERMISSION_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `${PERMISSION_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useGetPermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApiSlice;
