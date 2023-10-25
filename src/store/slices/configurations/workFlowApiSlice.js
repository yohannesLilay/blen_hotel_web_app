import { apiSlice } from "../apiSlice"
const WORK_FLOW_ENDPOINT = "work-flows";

export const workFlowsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkFlows: builder.query({
      query: () => ({
        url: WORK_FLOW_ENDPOINT,
      }),
    }),
    getWorkFlowsTemplate: builder.query({
        query: () => ({
          url: `${WORK_FLOW_ENDPOINT}/template`,
        }),
      }),
    createWorkFlow: builder.mutation({
      query: (data) => ({
        url: `${WORK_FLOW_ENDPOINT}/`,
        method: "POST",
        body: data,
      }),
    }),
    getWorkFlow: builder.query({
      query: (id) => ({
        url: `${WORK_FLOW_ENDPOINT}/${id}`,
      }),
    }),
    updateWorkFlow: builder.mutation({
      query: (data) => ({
        url: `${WORK_FLOW_ENDPOINT}/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteWorkFlow: builder.mutation({
      query: (id) => ({
        url: `${WORK_FLOW_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetWorkFlowsQuery,
  useGetWorkFlowsTemplateQuery,
  useCreateWorkFlowMutation,
  useGetWorkFlowQuery,
  useUpdateWorkFlowMutation,
  useDeleteWorkFlowMutation,
} = workFlowsApiSlice;
