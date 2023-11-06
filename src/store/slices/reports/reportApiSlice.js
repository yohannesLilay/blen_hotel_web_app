import { apiSlice } from "../apiSlice"
const REPORT_ENDPOINT = "reports";

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInfoReport: builder.query({
      query: () => ({ url: `${REPORT_ENDPOINT}/info` }),
    }),
  }),
});

export const {
  useGetInfoReportQuery,
} = reportsApiSlice;
