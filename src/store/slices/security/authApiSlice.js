import { apiSlice } from "../apiSlice";
const AUTH_ENDPOINT = "auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_ENDPOINT}/login`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_ENDPOINT}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: `${AUTH_ENDPOINT}/refresh-token`,
        credentials: "include",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH_ENDPOINT}/change-password`,
        method: "POST",
        body: data,
        credentials: "include"
      })
    })
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation, useChangePasswordMutation } =
  authApiSlice;
