import { apiSlice } from "../apiSlice"
const ORDER_ENDPOINT = "purchase-orders";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: ORDER_ENDPOINT,
      }),
    }),
    getOrderTemplate: builder.query({
      query: () => ({
        url: `${ORDER_ENDPOINT}/template`
      })
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    createOrderItem: builder.mutation({
      query: (data) => ({
        url: `${ORDER_ENDPOINT}/${data.id}`,
        method: "POST",
        body: data,
      }),
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `${ORDER_ENDPOINT}/${id}`,
      }),
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDER_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteOrderItem: builder.mutation({
      query: ({id, item_id}) => ({
        url: `${ORDER_ENDPOINT}/${id}/items/${item_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderTemplateQuery,
  useCreateOrderMutation,
  useCreateOrderItemMutation,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useDeleteOrderItemMutation
} = ordersApiSlice;
