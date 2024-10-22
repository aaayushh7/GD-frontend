import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, Package, ShoppingBag } from 'lucide-react';

const Loader = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white/50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const Message = ({ children, variant }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 mb-4 rounded-lg ${
      variant === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
    }`}
  >
    {children}
  </motion.div>
);

const OrderStatus = ({ isPaid, isShipped, isDelivered }) => {
  const steps = [
    { title: 'Order Placed', Icon: ShoppingBag, status: true },
    { title: 'Payment', Icon: CheckCircle, status: isPaid },
    { title: 'Shipped', Icon: Truck, status: isShipped },
    { title: 'Delivered', Icon: Package, status: isDelivered },
  ];

  return (
    <div className="relative mt-6 mb-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-full p-2 ${
                step.status ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <step.Icon size={16} />
            </motion.div>
            <span className="text-xs mt-1 text-gray-600">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200">
        <div
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{
            width: `${
              ((isPaid ? 1 : 0) + (isShipped ? 1 : 0) + (isDelivered ? 1 : 0)) * 33.33
            }%`,
          }}
        />
      </div>
    </div>
  );
};

const OrderItem = React.memo(({ order }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-sm overflow-hidden mb-3 border border-gray-100"
  >
    <div className="p-4">
      <div className="flex items-center mb-3">
        <img
          src={order.orderItems[0].image}
          alt={order.user}
          className="w-12 h-12 object-cover rounded-lg mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-black truncate">
            {order.orderItems[0].name}
          </h3>
          <p className="text-xs text-gray-500">Order ID: {order._id.slice(-8)}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-yellow-400">₹{order.totalPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <OrderStatus 
        isPaid={order.isPaid}
        isShipped={order.isShipped}
        isDelivered={order.isDelivered}
      />

      <Link to={`/order/${order._id}`}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          View Details
        </motion.button>
      </Link>
    </div>
  </motion.div>
));

const UserOrder = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleRefetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
    refetch();
  }, [refetch]);

  const observerRef = useRef();
  const [visibleOrders, setVisibleOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      setVisibleOrders(orders.slice(0, 5));
    }
  }, [orders]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleOrders.length < orders?.length) {
          setVisibleOrders(prev => [
            ...prev,
            ...orders.slice(prev.length, prev.length + 5)
          ]);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [visibleOrders, orders]);

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">My Orders</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefetch}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
        >
          Refresh
        </motion.button>
      </div>

      <AnimatePresence>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {visibleOrders.map((order) => (
              <OrderItem key={order._id} order={order} />
            ))}
            {visibleOrders.length < orders?.length && (
              <div ref={observerRef} className="h-8" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOrder;