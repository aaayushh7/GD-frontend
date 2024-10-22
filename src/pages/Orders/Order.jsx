import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import PaymentMethodInfo from "../../components/PaymentMethod";
import PostPaymentNote from "../../components/PostPaymentNote";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useShipOrderMutation
} from "../../redux/api/orderApiSlice";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";
import { load } from "@cashfreepayments/cashfree-js";
import { FaShoppingBag, FaTruck, FaInfoCircle, FaBox, FaCreditCard, FaCheckCircle, FaChevronUp, FaChevronDown, FaTimesCircle, FaSpinner } from "react-icons/fa";

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

const PaymentStatus = ({ isPaid, isShipped, paidAt, shippedAt, isLoading, paymentMethod }) => {
  if (isLoading) {
    return (
      <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse">
        <h3 className="font-semibold text-orange-700 mb-2">Order Status</h3>
        <div className="flex items-center space-x-2 text-gray-500">
          <FaSpinner className="animate-spin" />
          <span>Loading status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4">
        <h3 className="font-semibold text-orange-700 mb-2">Payment Status</h3>
        {isPaid ? (
          <div className="flex items-center space-x-2 text-green-600">
            <FaCheckCircle className="text-xl" />
            <span className="font-medium">
              Paid on {new Date(paidAt).toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-red-500">
            <FaTimesCircle className="text-xl" />
            <span className="font-medium">Payment Pending</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-orange-700 mb-2">Delivery Status</h3>
        {isShipped ? (
          <div className="flex items-center space-x-2 text-green-600">
            <FaCheckCircle className="text-xl" />
            <span className="font-medium">
              Shipped on {new Date(shippedAt).toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-red-500">
            <FaTimesCircle className="text-xl" />
            <span className="font-medium">Not Yet Shipped</span>
          </div>
        )}
        {paymentMethod === 'Pay on Delivery' && !isPaid && (
          <div className="mt-2 text-orange-600">
            <FaInfoCircle className="inline-block mr-2" />
            <span>Your order will reach you in approximately 20 minutes.</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Order = () => {
  const { id: orderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const paymentSessionId = params.get('paymentSessionId');
  const paymentCompleted = params.get('paymentCompleted');
  const [cashfree, setCashfree] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleOrderInfo = () => {
    setShowOrderInfo(!showOrderInfo);
  };

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [shipOrder, { isLoading: loadingShip }] = useShipOrderMutation();
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

  const shipHandler = async () => {
    try {
      await shipOrder(orderId);
      refetch();
      toast.success("Order marked as shipped");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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

  const handlePayment = async () => {
    if (order.paymentMethod === 'Pay on Delivery') {
      await markAsPaid(orderId);
      dispatch(savePaymentMethod('PayPal'));
      refetch();
    } else {
      handleCashfreePayment();
    }
  };

  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="bg-gray-50 min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-400 flex items-center">
          <FaBox className="mr-3 text-gray-600" /> Your Order
        </h1>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300 flex items-center">
            <FaShoppingBag className="mr-2 text-yellow-400" /> Items
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
                      <Link to={`/product/${item.product}`} className="text-gray-800 hover:text-orange-800 font-medium">
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

        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300 flex items-center">
            <FaShoppingBag className="mr-2 text-yellow-400" /> Order Summary
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
              <div className="flex justify-between text-lg font-bold text-gray-700 mb-1">
                <span>Total:</span>
                <span>₹ {order.totalPrice}</span>
              </div>
              <button
                onClick={toggleDetails}
                className="w-30% flex items-center text-[10px] text-gray-600 duration-300 rounded-md"
              >
                <span>View Details  </span>
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showDetails && (
                <div className="space-y-2 text-gray-700 mt-4 transition-all duration-300 ease-in-out">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">₹ {order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
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
        </div>
      </div>

      {!isLoading && (
        <div className="fixed bottom-16 left-0 right-0 bg-white rounded-lg shadow-md">
          <div className="max-w-3xl mx-auto">
            <div 
              className={`transition-all duration-300 ease-in-out overflow-auto rounded-xl ${
                showOrderInfo ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 bg-white border shadow-xl rounded-lg">
                <h3 className="font-semibold text-orange-700 mb-2">Delivery Address</h3>
                <p className="text-gray-700">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                <PaymentMethodInfo 
                  paymentMethod={order.paymentMethod}
                  isPaid={order.isPaid}
                />
                <PaymentStatus 
                  isPaid={order.isPaid} 
                  isShipped={order.isShipped}
                  paidAt={order.paidAt}
                  shippedAt={order.shippedAt}
                  isLoading={isLoading} 
                  paymentMethod={order.paymentMethod}
                />
                {order.isPaid && <PostPaymentNote />}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div 
                className="w-1/2 pr-2 cursor-pointer"
                onClick={toggleOrderInfo}
              >
                <p className="text-sm text-gray-600">Delivery to:</p>
                <p className="font-medium text-gray-800 truncate">
                {order.shippingAddress.address.slice(0, 20)}...
                </p>
                <div className="text-gray-500 text-[9px]">
                  {showOrderInfo ? 'Hide Details' : 'Show Details'}
                </div>
              </div>
              {!order.isPaid ? (
                <button
                  type="button"
                  className="w-1/2 bg-yellow-400 text-gray-700 py-3 px-4 rounded-md hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={handlePayment}
                  disabled={loadingPay}
                >
                  <FaCreditCard className="mr-2" />
                  {loadingPay ? "Processing..." : "Pay Now"}
                </button>
              ) : userInfo && userInfo.isAdmin ? (
                !order.isShipped ? (
                  <button
                    type="button"
                    className="w-1/2 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                    onClick={shipHandler}
                    disabled={loadingShip}
                  >
                    <FaTruck className="mr-2" />
                    {loadingShip ? "Processing..." : "Mark As Shipped"}
                  </button>
                ) : !order.isDelivered ? (
                  <button
                    type="button"
                    className="w-1/2 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                  >
                    <FaTruck className="mr-2" />
                    {loadingDeliver ? "Processing..." : "Mark As Delivered"}
                  </button>
                ) : (
                  <span className="w-1/2 bg-green-500 text-white py-3 px-4 rounded-md flex items-center justify-center">
                    <FaCheckCircle className="mr-2" />
                    Delivered
                  </span>
                )
              ) : (
                <span className="w-1/2 bg-green-500 text-white py-3 px-4 rounded-md flex items-center justify-center">
                  <FaCheckCircle className="mr-2" />
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {(loadingDeliver || loadingShip) && <Loader />}
    </div>
  );
};

export default Order;