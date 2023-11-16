import { apiSlice } from "../apiSlice"
const CAPTAIN_ORDER_ENDPOINT = "captain-orders";

export const captainOrdersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCaptainOrders: builder.query({
      query: ({page, limit, search }) => ({
        url: CAPTAIN_ORDER_ENDPOINT,
        params: { page, limit, search },
      }),
    }),
    getCaptainOrderTemplate: builder.query({
      query: () => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/template`
      })
    }),
    createCaptainOrder: builder.mutation({
      query: (data) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    createCaptainOrderItem: builder.mutation({
      query: (data) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getCaptainOrder: builder.query({
      query: (id) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${id}`,
      }),
    }),
    updateCaptainOrder: builder.mutation({
      query: (data) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    printCaptainOrder: builder.mutation({
      query: ({id}) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${id}/print`,
        method: "PATCH",
      }),
    }),
    deleteCaptainOrder: builder.mutation({
      query: (id) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteCaptainOrderItem: builder.mutation({
      query: ({id, item_id}) => ({
        url: `${CAPTAIN_ORDER_ENDPOINT}/${id}/items/${item_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCaptainOrdersQuery,
  useGetCaptainOrderTemplateQuery,
  useCreateCaptainOrderMutation,
  useCreateCaptainOrderItemMutation,
  useGetCaptainOrderQuery,
  useUpdateCaptainOrderMutation,
  usePrintCaptainOrderMutation,
  useDeleteCaptainOrderMutation,
  useDeleteCaptainOrderItemMutation
} = captainOrdersApiSlice;
