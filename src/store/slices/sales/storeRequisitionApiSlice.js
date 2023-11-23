import { apiSlice } from "../apiSlice"
const STORE_REQUISITION_ENDPOINT = "store-requisitions";

export const storeRequisitionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreRequisitions: builder.query({
      query: ({page, limit, search }) => ({
        url: STORE_REQUISITION_ENDPOINT,
        params: { page, limit, search },
      }),
    }),
    getStoreRequisitionTemplate: builder.query({
      query: () => ({
        url: `${STORE_REQUISITION_ENDPOINT}/template`
      })
    }),
    createStoreRequisition: builder.mutation({
      query: (data) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    createStoreRequisitionItem: builder.mutation({
      query: (data) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getStoreRequisition: builder.query({
      query: (id) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${id}`,
      }),
    }),
    updateStoreRequisition: builder.mutation({
      query: (data) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    approveStoreRequisition: builder.mutation({
      query: ({id}) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${id}/approve`,
        method: "PATCH",
      }),
    }),
    releaseStoreRequisition: builder.mutation({
      query: ({id}) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${id}/release`,
        method: "PATCH",
      }),
    }),
    deleteStoreRequisition: builder.mutation({
      query: (id) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteStoreRequisitionItem: builder.mutation({
      query: ({id, item_id}) => ({
        url: `${STORE_REQUISITION_ENDPOINT}/${id}/items/${item_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetStoreRequisitionsQuery,
  useGetStoreRequisitionTemplateQuery,
  useCreateStoreRequisitionMutation,
  useCreateStoreRequisitionItemMutation,
  useGetStoreRequisitionQuery,
  useUpdateStoreRequisitionMutation,
  useApproveStoreRequisitionMutation,
  useReleaseStoreRequisitionMutation,
  useDeleteStoreRequisitionMutation,
  useDeleteStoreRequisitionItemMutation
} = storeRequisitionsApiSlice;
