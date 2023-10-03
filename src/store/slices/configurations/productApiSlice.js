import { apiSlice } from "../apiSlice"
const PRODUCT_ENDPOINT = "products";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCT_ENDPOINT,
      }),
    }),
    getProductTemplate: builder.query({
        query: () => ({
          url: `${PRODUCT_ENDPOINT}/template`,
        }),
      }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `${PRODUCT_ENDPOINT}/${id}`,
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductTemplateQuery,
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
