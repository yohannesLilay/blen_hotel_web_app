import { apiSlice } from "../apiSlice"
const RECEIVABLE_ENDPOINT = "purchase-receivables";

export const receivablesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceivables: builder.query({
      query: () => ({
        url: RECEIVABLE_ENDPOINT,
      }),
    }),
    getReceivableTemplate: builder.query({
      query: () => ({
        url: `${RECEIVABLE_ENDPOINT}/template`
      })
    }),
    createReceivable: builder.mutation({
      query: (data) => ({
        url: `${RECEIVABLE_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    createReceivableItem: builder.mutation({
      query: (data) => ({
        url: `${RECEIVABLE_ENDPOINT}/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getReceivable: builder.query({
      query: (id) => ({
        url: `${RECEIVABLE_ENDPOINT}/${id}`,
      }),
    }),
    updateReceivable: builder.mutation({
      query: (data) => ({
        url: `${RECEIVABLE_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateReceivableStatus: builder.mutation({
      query: ({id, command}) => ({
        url: `${RECEIVABLE_ENDPOINT}/${id}/change-status`,
        method: "PATCH",
        params: { command },
      }),
    }),
    deleteReceivable: builder.mutation({
      query: (id) => ({
        url: `${RECEIVABLE_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteReceivableItem: builder.mutation({
      query: ({id, item_id}) => ({
        url: `${RECEIVABLE_ENDPOINT}/${id}/items/${item_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetReceivablesQuery,
  useGetReceivableTemplateQuery,
  useCreateReceivableMutation,
  useCreateReceivableItemMutation,
  useGetReceivableQuery,
  useUpdateReceivableMutation,
  useUpdateReceivableStatusMutation,
  useDeleteReceivableMutation,
  useDeleteReceivableItemMutation
} = receivablesApiSlice;
