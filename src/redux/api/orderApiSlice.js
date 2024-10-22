import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL, COUPONS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),
    validateCoupon: builder.mutation({
      query: ({ code, userId }) => ({
        url: `${COUPONS_URL}/validate`,
        method: 'POST',
        body: { code, userId },
      }),
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: COUPONS_URL,
        method: 'POST',
        body: couponData,
      }),
    }),
    updateCoupon: builder.mutation({
      query: ({ couponId, updatedCoupon }) => ({
        url: `${COUPONS_URL}/${couponId}`,
        method: 'PUT',
        body: updatedCoupon,
      }),
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `${COUPONS_URL}/${couponId}`,
        method: 'DELETE',
      }),
    }),
    fetchCoupons: builder.query({
      query: () => ({
        url: COUPONS_URL,
      }),
      providesTags: ["Coupon"],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    shipOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/ship`,
        method: "PUT",
      }),
    }),
    cashfreeOrder: builder.mutation({
      query: ({ orderId, paymentDetails }) => ({
        url: `${ORDERS_URL}/${orderId}/cashfree`,
        method: "POST",
        body: paymentDetails,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
    verifyPayment: builder.mutation({
      query: ({ orderId, paymentSessionId }) => ({
        url: `${ORDERS_URL}/${orderId}/verify-payment`,
        method: 'POST',
        body: { paymentSessionId },
      }),
    }),
    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),
    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useShipOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useValidateCouponMutation,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useFetchCouponsQuery,
  useVerifyPaymentMutation,
  useCashfreeOrderMutation,
} = orderApiSlice;