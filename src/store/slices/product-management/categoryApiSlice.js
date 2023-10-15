import { apiSlice } from "../apiSlice"
const CATEGORY_ENDPOINT = "categories";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({page, limit, search }) => ({
        url: CATEGORY_ENDPOINT,
        params: { page, limit, search },
      }),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    importCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_ENDPOINT}/import`,
        method: "POST",
        body: data
      })
    }),
    getCategory: builder.query({
      query: (id) => ({
        url: `${CATEGORY_ENDPOINT}/${id}`,
      }),
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useImportCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
