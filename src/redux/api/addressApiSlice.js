import { apiSlice } from "./apiSlice";

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveAddress: builder.mutation({
      query: (data) => ({
        url: "/api/address",
        method: "POST",
        body: data,
      }),
    }),
    getUserAddress: builder.query({
      query: () => ({
        url: "/api/address",
        method: "GET",
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSaveAddressMutation,
  useGetUserAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApiSlice;
