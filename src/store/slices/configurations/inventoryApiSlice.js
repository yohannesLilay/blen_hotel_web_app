import { apiSlice } from "../apiSlice"
const INVENTORY_ENDPOINT = "inventories";

export const inventoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query({
      query: () => ({
        url: INVENTORY_ENDPOINT,
      }),
    }),
    getInventoryTemplate: builder.query({
        query: () => ({
          url: `${INVENTORY_ENDPOINT}/template`,
        }),
      }),
    createInventory: builder.mutation({
      query: (data) => ({
        url: `${INVENTORY_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getInventory: builder.query({
      query: (id) => ({
        url: `${INVENTORY_ENDPOINT}/${id}`,
      }),
    }),
    updateInventory: builder.mutation({
      query: (data) => ({
        url: `${INVENTORY_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteInventory: builder.mutation({
      query: (id) => ({
        url: `${INVENTORY_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetInventoriesQuery,
  useGetInventoryTemplateQuery,
  useCreateInventoryMutation,
  useGetInventoryQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoriesApiSlice;
