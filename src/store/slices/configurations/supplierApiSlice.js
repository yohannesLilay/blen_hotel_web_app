import { apiSlice } from "../apiSlice"
const SUPPLIER_ENDPOINT = "suppliers";

export const suppliersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => ({
        url: SUPPLIER_ENDPOINT,
      }),
    }),
    createSupplier: builder.mutation({
      query: (data) => ({
        url: `${SUPPLIER_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getSupplier: builder.query({
      query: (id) => ({
        url: `${SUPPLIER_ENDPOINT}/${id}`,
      }),
    }),
    updateSupplier: builder.mutation({
      query: (data) => ({
        url: `${SUPPLIER_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIER_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApiSlice;
