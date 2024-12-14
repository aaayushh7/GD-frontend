import { apiSlice } from "./apiSlice";

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveAddress: builder.mutation({
      query: (data) => ({
        url: "/api/address",
        method: "POST",
        body: data,
      }),
      // Invalidate and refetch addresses after saving
      invalidatesTags: ['Addresses']
    }),
    getUserAddresses: builder.query({
      query: () => ({
        url: "/api/address",
        method: "GET",
      }),
      // Add a tag for caching and invalidation
      providesTags: ['Addresses']
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Addresses']
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Addresses']
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({
        url: `/api/address/${id}/default`,
        method: "PUT",
      }),
      invalidatesTags: ['Addresses']
    })
  }),
});

export const {
  useSaveAddressMutation,
  useGetUserAddressesQuery, // Changed from useGetUserAddressesQuery
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation // New mutation
} = addressApiSlice;