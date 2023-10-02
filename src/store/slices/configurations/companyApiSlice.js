import { apiSlice } from "../apiSlice"
const COMPANY_ENDPOINT = "companies";

export const companiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => ({
        url: COMPANY_ENDPOINT,
      }),
    }),
    createCompany: builder.mutation({
      query: (data) => ({
        url: `${COMPANY_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getCompany: builder.query({
      query: (id) => ({
        url: `${COMPANY_ENDPOINT}/${id}`,
      }),
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: `${COMPANY_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `${COMPANY_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApiSlice;
