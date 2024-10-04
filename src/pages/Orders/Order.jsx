import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { load } from "@cashfreepayments/cashfree-js";
import { FaShoppingBag, FaTruck, FaMoneyBillWave, FaInfoCircle, FaBox, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaCreditCard, FaCheckCircle, FaChevronUp, FaChevronDown, FaTimesCircle, FaSpinner } from "react-icons/fa";

const SkeletonLoader = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
);

const OrderItemSkeleton = () => (
  <div className="flex items-center justify-between py-2 border-b border-gray-300">
    <div className="flex items-center space-x-4">
      <SkeletonLoader width="w-16" height="h-16" />
      <div>
        <SkeletonLoader width="w-32" />
        <SkeletonLoader width="w-20" height="h-3" />
      </div>
    </div>
    <div className="text-right">
      <SkeletonLoader width="w-20" />
      <SkeletonLoader width="w-24" height="h-3" />
    </div>
  </div>
);

const PaymentStatus = ({ isPaid, paidAt, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse">
        <h3 className="font-semibold text-amber-700 mb-2">Shipping Status</h3>
        <div className="flex items-center space-x-2 text-gray-500">
          <FaSpinner className="animate-spin" />
          <span>Loading status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="font-semibold text-amber-700 mb-2">Shipping Status</h3>
      {isPaid ? (
        <div className="flex items-center space-x-2 text-green-600">
          <FaCheckCircle className="text-xl" />
          <span className="font-medium">
            Shipped on {new Date(paidAt).toLocaleString()}
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-red-500">
          <FaTimesCircle className="text-xl" />
          <span className="font-medium">Not Yet Shipped</span>
        </div>
      )}
    </div>
  );
};

const Order = () => {
  const { id: orderId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentSessionId = params.get('paymentSessionId');
  const paymentCompleted = params.get('paymentCompleted');
  const [cashfree, setCashfree] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const markAsPaid = useCallback(async (orderId) => {
    try {
      await payOrder({ orderId, details: { payer: {} } }).unwrap();
      await refetch();
      toast.success("Order marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }, [payOrder, refetch]);

  useEffect(() => {
    const initCashfree = async () => {
      console.log('Initializing Cashfree');
      try {
        const cashfreeInstance = await load({ mode: "sandbox" });
        setCashfree(cashfreeInstance);
        console.log('Cashfree version:', cashfreeInstance.version());
      } catch (error) {
        console.error('Error initializing Cashfree:', error);
      }
    };

    initCashfree();

    if (paymentSessionId && paymentCompleted === 'true' && order && !order.isPaid) {
      markAsPaid(orderId);
    }
  }, [paymentSessionId, paymentCompleted, orderId, order, markAsPaid]);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleCashfreePayment = async () => {
    if (!cashfree) {
      toast.error('Cashfree is not initialized yet');
      return;
    }
    try {
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/order/${orderId}?paymentSessionId=${paymentSessionId}&paymentCompleted=true`,
      };
      cashfree.checkout(checkoutOptions).then(function (result) {
        if (result.error) {
          console.error('Payment error:', result.error);
          toast.error(result.error.message || 'Payment failed');
        }
        if (result.redirect) {
          console.log("Redirecting to payment gateway");
        }
      });
    } catch (error) {
      console.error('Error initiating Cashfree payment:', error);
      toast.error(error?.message || 'Failed to initiate payment');
    }
  };

  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="bg-amber-50 min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-amber-800 mb-6 pb-2 border-b-2 border-yellow-400 flex items-center">
          <FaBox className="mr-3 text-amber-600" /> Order Details
        </h1>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-300 flex items-center">
            <FaShoppingBag className="mr-2 text-amber-500" /> Items
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <OrderItemSkeleton key={index} />
              ))}
            </div>
          ) : order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-300">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-300" />
                    <div>
                      <Link to={`/product/${item.product}`} className="text-amber-600 hover:text-amber-800 font-medium">
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total: ₹{(item.qty * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-300 flex items-center">
            <FaInfoCircle className="mr-2 text-amber-500" /> Order Information
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-semibold text-amber-700">Shipping Address</h3>
                <p className="text-gray-700">
                  {order.shippingAddress.address}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}, {order.shippingAddress.city}
                </p>
              </div>
              <PaymentStatus
                isPaid={order.isPaid}
                paidAt={order.paidAt}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mt-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b border-gray-300 flex items-center">
            <FaShoppingBag className="mr-2 text-amber-500" /> Order Summary
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader height="h-6" />
            </div>
          ) : (
            <>
              <div className="flex justify-between text-lg font-bold text-amber-600 mb-4">
                <span>Total:</span>
                <span>₹ {order.totalPrice}</span>
              </div>
              <button
                onClick={toggleDetails}
                className="w-full flex items-center justify-between bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300 p-2 rounded-md"
              >
                <span>View Details</span>
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showDetails && (
                <div className="space-y-2 text-gray-700 mt-4 transition-all duration-300 ease-in-out">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">₹ {order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-medium">₹ {order.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-medium">₹ {order.taxPrice}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading && !order.isPaid && (
            <button
              type="button"
              className="mt-4 bg-[#facc15] text-white w-full py-2 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center"
              onClick={handleCashfreePayment}
              disabled={!cashfree}
            >
              <FaCreditCard className="mr-2" />
              {loadingPay ? "Processing..." : "Pay with Cashfree"}
            </button>
          )}

          {loadingDeliver && <Loader />}
          {!isLoading && userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              className="mt-4 bg-amber-500 text-white py-3 px-6 rounded-md w-full hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center"
              onClick={deliverHandler}
            >
              <FaTruck className="mr-2" />
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
