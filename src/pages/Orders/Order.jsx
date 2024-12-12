// src/pages/Order.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { load } from "@cashfreepayments/cashfree-js";
import { FaBox, FaShoppingBag } from "react-icons/fa";
import { ArrowBack } from '@mui/icons-material';
import { Button } from "@mui/material"

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import OrderItems from "./orderComponents/OrderItems";
import OrderSummary from "./orderComponents/OrderSummary";
import OrderBottomBar from "./orderComponents/OrderBottomBar";
import PaymentStatus from "./orderComponents/PaymentStatus";
import PaymentMethodInfo from "../../components/PaymentMethod";
import PostPaymentNote from "../../components/PostPaymentNote";
import OrderStatusCard from "./orderComponents/OrderStatusCard";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useShipOrderMutation
} from "../../redux/api/orderApiSlice";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const paymentSessionId = params.get('paymentSessionId');
  const paymentCompleted = params.get('paymentCompleted');

  const [cashfree, setCashfree] = useState(null);
  const [showOrderInfo, setShowOrderInfo] = useState(false);

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
    <div className="bg-gray-50 min-h-screen py-4 sm:py-6 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center p-4 ">
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              my: 0,
              color: '#1A1A1A',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          />
          <h1 className="text-xl text-gray-800">Order Details</h1>
        </div>

        <div className="rounded-lg mb-0 p-4">

          <OrderItems
            isLoading={isLoading}
            orderItems={order?.orderItems}
          />
        </div>
        <div className="mb-0 p-3 bg-gradient-to-r w-full from-[#cae6da0d] to-[#d2e9df]">
          <div className="flex items-center">
            <span className="text-sm text-black pl-5">Total Amount :  </span>
            <span className="text-md text-green-800 ml-auto">₹ {order?.totalPrice}</span>
          </div>
        </div>

        

        <div className="p-4 ">
        <OrderStatusCard
            order={order}
            orderId={order?._id}
            isPaid={order?.isPaid}
            isShipped={order?.isShipped}
            isDelivered={order?.isDelivered}
            createdAt={order?.createdAt}
            address={`${order?.shippingAddress.address}, ${order?.shippingAddress.city}, ${order?.shippingAddress.postalCode}, ${order?.shippingAddress.country}`}
            phoneNumber={order?.shippingAddress.country} // Add this line
            userInfo={userInfo}
          />
          <h2 className="text-md text-gray-600 mb-4 pt-4 flex items-center border-t-2 border-gray-300 rounded-t-sm border-dashed mt-4">
            Price Details
          </h2>
          <OrderSummary
            isLoading={isLoading}
            order={order}
          />
          
          
        </div>

      </div>

      {!isLoading && (
        <div className="fixed bottom-16 left-0 right-0 bg-white rounded-lg shadow-md">
          <div className="max-w-3xl mx-auto">
            <div
              className={`transition-all duration-300 ease-in-out overflow-auto rounded-xl ${showOrderInfo ? 'max-h-96' : 'max-h-0'
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
            

          </div>
        </div>
      )}

      {(loadingDeliver || loadingShip) && <Loader />}
    </div>
  );
};

export default Order;