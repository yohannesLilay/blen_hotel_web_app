import { apiSlice } from "../apiSlice"
const REPORT_ENDPOINT = "reports";

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInfoReport: builder.query({
      query: () => ({ url: `${REPORT_ENDPOINT}/info` }),
    }),
    getReportTemplate: builder.query({
      query: () => ({
        url: `${REPORT_ENDPOINT}/template`
      })
    }),
    getTopUsedMenusReport: builder.query({
      query: () => ({
        url: `${REPORT_ENDPOINT}/top-used-menus`
      })
    }),
    getTopIncomeMenusReport: builder.query({
      query: () => ({
        url: `${REPORT_ENDPOINT}/top-income-menus`
      })
    }),
    getRoomRevenueReport: builder.mutation({
      query: (data) => ({
        url: `${REPORT_ENDPOINT}/room-revenues`,
        method: "POST",
        body: data,
      }),
    }),
    getSalesByStaffReport: builder.mutation({
      query: (data) => ({
        url: `${REPORT_ENDPOINT}/sales-by-staff`,
        method: "POST",
        body: data,
      }),
    }),
    getPeriodicSalesReport: builder.mutation({
      query: (data) => ({
        url: `${REPORT_ENDPOINT}/periodic-sales`,
        method: "POST",
        body: data,
      }),
    }),
    getReorderStatusReport: builder.mutation({
      query: (data) => ({
        url: `${REPORT_ENDPOINT}/reorder-status`,
        method: "POST",
        body: data,
      }),
    }),
    getProductSalesReport: builder.mutation({
      query: (data) => ({
        url: `${REPORT_ENDPOINT}/product-sales`,
        method: "POST",
        body: data,
      }),
    })
  }),
});

export const {
  useGetInfoReportQuery,
  useGetReportTemplateQuery,
  useGetTopUsedMenusReportQuery,
  useGetTopIncomeMenusReportQuery,
  useGetRoomRevenueReportMutation,
  useGetSalesByStaffReportMutation,
  useGetPeriodicSalesReportMutation,
  useGetReorderStatusReportMutation,
  useGetProductSalesReportMutation
} = reportsApiSlice;
