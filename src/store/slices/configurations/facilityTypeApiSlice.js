import { apiSlice } from "../apiSlice"
const FACILITY_TYPE_ENDPOINT = "facility-types";

export const facilityTypesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacilityTypes: builder.query({
      query: () => ({
        url: FACILITY_TYPE_ENDPOINT,
      }),
    }),
    getFacilityTypesTemplate: builder.query({
      query: () => ({
        url: `${FACILITY_TYPE_ENDPOINT}/template`,
      }),
    }),
    createFacilityType: builder.mutation({
      query: (data) => ({
        url: `${FACILITY_TYPE_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getFacilityType: builder.query({
      query: (id) => ({
        url: `${FACILITY_TYPE_ENDPOINT}/${id}`,
      }),
    }),
    updateFacilityType: builder.mutation({
      query: (data) => ({
        url: `${FACILITY_TYPE_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteFacilityType: builder.mutation({
      query: (id) => ({
        url: `${FACILITY_TYPE_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetFacilityTypesQuery,
  useGetFacilityTypesTemplateQuery,
  useCreateFacilityTypeMutation,
  useGetFacilityTypeQuery,
  useUpdateFacilityTypeMutation,
  useDeleteFacilityTypeMutation,
} = facilityTypesApiSlice;
