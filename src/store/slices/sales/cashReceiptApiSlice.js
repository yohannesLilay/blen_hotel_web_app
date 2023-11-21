import { apiSlice } from "../apiSlice"
const CASH_RECEIPT_ENDPOINT = "cash-receipts";

export const cashReceiptsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCashReceipts: builder.query({
      query: ({page, limit, search }) => ({
        url: CASH_RECEIPT_ENDPOINT,
        params: { page, limit, search },
      }),
    }),
    getCashReceiptTemplate: builder.query({
      query: ({filter}) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/template`,
        params: { filter}
      })
    }),
    createCashReceipt: builder.mutation({
      query: (data) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    createCashReceiptItem: builder.mutation({
      query: (data) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getCashReceipt: builder.query({
      query: (id) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${id}`,
      }),
    }),
    updateCashReceipt: builder.mutation({
      query: (data) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    printCashReceipt: builder.mutation({
      query: ({id}) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${id}/print`,
        method: "PATCH",
      }),
    }),
    deleteCashReceipt: builder.mutation({
      query: (id) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteCashReceiptItem: builder.mutation({
      query: ({id, item_id}) => ({
        url: `${CASH_RECEIPT_ENDPOINT}/${id}/items/${item_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCashReceiptsQuery,
  useGetCashReceiptTemplateQuery,
  useCreateCashReceiptMutation,
  useCreateCashReceiptItemMutation,
  useGetCashReceiptQuery,
  useUpdateCashReceiptMutation,
  usePrintCashReceiptMutation,
  useDeleteCashReceiptMutation,
  useDeleteCashReceiptItemMutation
} = cashReceiptsApiSlice;
