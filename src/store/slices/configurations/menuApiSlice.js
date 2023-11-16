import { apiSlice } from "../apiSlice"
const MENU_ENDPOINT = "menus";

export const menusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: ({page, limit, search }) => ({
        url: MENU_ENDPOINT,
        params: { page, limit, search },
      }),
    }),
    createMenu: builder.mutation({
      query: (data) => ({
        url: `${MENU_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    importMenu: builder.mutation({
      query: (data) => ({
        url: `${MENU_ENDPOINT}/import`,
        method: "POST",
        body: data
      })
    }),
    getMenu: builder.query({
      query: (id) => ({
        url: `${MENU_ENDPOINT}/${id}`,
      }),
    }),
    updateMenu: builder.mutation({
      query: (data) => ({
        url: `${MENU_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `${MENU_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMenusQuery,
  useCreateMenuMutation,
  useImportMenuMutation,
  useGetMenuQuery,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menusApiSlice;
