import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { enqueueSnackbar } from "notistack";
import { logout as logoutAction } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/",
  credentials: "include",
});

let isRefreshing = false;

const baseQueryWithInterceptors = async (args, api, extraOptions) => {
  try {
    const response = await baseQuery(args, api, extraOptions);

    if (!response.meta.response.ok) {
      if (response?.error?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshResponse = await baseQuery(
            { url: "auth/refresh-token", method: "GET" },
            api,
            extraOptions
          );
          if (refreshResponse.error) {
            api.dispatch(logoutAction());
          } else {
            isRefreshing = false;
            return baseQuery(args, api, extraOptions);
          }
        } else {
          api.dispatch(logoutAction());
        }
      } else {
        let errorResponse = response.error.data;
        if (Array.isArray(errorResponse.message)) {
          response.error.data.message.forEach((err) => {
            enqueueSnackbar(err, { variant: "error" });
          });
        } else {
          enqueueSnackbar(
            errorResponse.message || "An unknown error occurred",
            { variant: "error" }
          );
        }
      }
    }

    return response;
  } catch (error) {
    enqueueSnackbar(error, { variant: "error" });
    throw error;
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithInterceptors,
  tagTypes: ["Auth", "User", "Role", "Permission", "Branch", "Machine", "Customer", "Vendor", "ExpenseType", "ProductCategory", "Product"],
  keepUnusedDataFor: 0,
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});
