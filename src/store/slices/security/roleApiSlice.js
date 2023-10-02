import { apiSlice } from "../apiSlice"
const ROLE_ENDPOINT = "roles";

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        url: ROLE_ENDPOINT,
      }),
    }),
    getRolesTemplate: builder.query({
      query: () => ({
        url: `${ROLE_ENDPOINT}/template`,
      }),
    }),
    createRole: builder.mutation({
      query: (data) => ({
        url: `${ROLE_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getRole: builder.query({
      query: (id) => ({
        url: `${ROLE_ENDPOINT}/${id}`,
      }),
    }),
    updateRole: builder.mutation({
      query: (data) => ({
        url: `${ROLE_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `${ROLE_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRolesTemplateQuery,
  useCreateRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApiSlice;
