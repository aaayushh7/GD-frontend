import React, { useState, useEffect, useRef } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeliverOrderMutation, usePayOrderMutation, useShipOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import NotificationSound from "../../assets/sound.mp3"


const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery({}, {
    pollingInterval: 5000, // Poll for updates every 5 seconds
  });
  
  const [sortedOrders, setSortedOrders] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [continuousSound, setContinuousSound] = useState(false);
  const audioRef = useRef(null);
  
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [shipOrder, { isLoading: loadingShip }] = useShipOrderMutation();


  useEffect(() => {
    if (orders) {
      const sorted = [...orders].sort((a, b) => {
        if ((!a.isDelivered || !a.isPaid || !a.isShipped) && (b.isDelivered && b.isPaid && b.isShipped)) return -1;
        if ((a.isDelivered && a.isPaid && a.isShipped) && (!b.isDelivered || !b.isPaid || !b.isShipped)) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      if (sortedOrders.length > 0 && sorted.length > sortedOrders.length) {
        setPlaySound(true);
        setContinuousSound(true);
      }

      setSortedOrders(sorted);
    }
  }, [orders]);

  useEffect(() => {
    if (playSound) {
      audioRef.current.play();
      if (!continuousSound) {
        setTimeout(() => {
          setPlaySound(false);
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }, 5000);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playSound, continuousSound]);

  const stopSound = () => {
    setPlaySound(false);
    setContinuousSound(false);
  };

  const markAsDelivered = async (orderId) => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const markAsPaid = async (orderId) => {
    try {
      await payOrder({ orderId, details: { payer: {} } });
      refetch();
      toast.success("Order marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const markAsShipped = async (orderId) => {
    try {
      await shipOrder(orderId);
      refetch();
      toast.success("Order marked as shipped");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen p-4">
      <AdminMenu />
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Orders</h1>
      <audio ref={audioRef} src={NotificationSound} loop={continuousSound} />
      {continuousSound && (
        <button 
          onClick={stopSound} 
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Stop Sound
        </button>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedOrders.map((order) => (
              <motion.div
                key={order._id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  !order.isDelivered || !order.isPaid
                    ? "animate-pulse border-2 border-red-500"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <span className="text-sm font-semibold text-amber-800">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-amber-900">Order #{order._id.slice(-6)}</h2>
                  <p className="text-gray-600 mb-2">User: {order.user ? order.user.username : "N/A"}</p>
                  <p className="text-2xl font-bold mb-4 text-amber-800">₹ {order.totalPrice}</p>
                  <div className="flex justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full ${order.isPaid ? "bg-green-500" : "bg-red-500"} text-white`}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${order.isDelivered ? "bg-green-500" : "bg-red-500"} text-white`}>
                      {order.isDelivered ? "Delivered" : "Undelivered"}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${order.isShipped ? "bg-green-500" : "bg-yellow-500"} text-white`}>
                      {order.isShipped ? "Shipped" : "Not Shipped"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/order/${order._id}`} className="flex-1">
                      <button className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
                        Details
                      </button>
                    </Link>
                    {!order.isDelivered && (
                      <button 
                        onClick={() => markAsDelivered(order._id)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        disabled={loadingDeliver}
                      >
                        {loadingDeliver ? "Loading..." : "Mark Delivered"}
                      </button>
                    )}
                     {!order.isShipped && (
                      <button 
                        onClick={() => markAsShipped(order._id)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                        disabled={loadingShip}
                      >
                        {loadingShip ? "Loading..." : "Mark Shipped"}
                      </button>
                    )}
                    {!order.isPaid && (
                      <button 
                        onClick={() => markAsPaid(order._id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        disabled={loadingPay}
                      >
                        {loadingPay ? "Loading..." : "Mark Paid"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderList;