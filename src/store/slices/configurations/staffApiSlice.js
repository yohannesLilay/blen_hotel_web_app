import { apiSlice } from "../apiSlice"
const STAFF_ENDPOINT = "staffs";

export const staffsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffs: builder.query({
      query: () => ({ url: STAFF_ENDPOINT }),
    }),
    getStaffTemplate: builder.query({
        query: () => ({
          url: `${STAFF_ENDPOINT}/template`,
        }),
      }),
    createStaff: builder.mutation({
      query: (data) => ({
        url: `${STAFF_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getStaff: builder.query({
      query: (id) => ({
        url: `${STAFF_ENDPOINT}/${id}`,
      }),
    }),
    updateStaff: builder.mutation({
      query: (data) => ({
        url: `${STAFF_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `${STAFF_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetStaffsQuery,
  useGetStaffTemplateQuery,
  useCreateStaffMutation,
  useGetStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffsApiSlice;
