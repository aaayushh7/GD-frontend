/* eslint-disable react/display-name */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ChevronRight, ShoppingBag } from '@mui/icons-material';
import { Button } from "@mui/material";

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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-sm">
    <ShoppingBag className="text-6xl text-gray-300 mb-4" />
    <h2 className="text-xl font-bold text-gray-800 mb-2">
      No Orders Yet
    </h2>
    <p className="text-gray-500 mb-4">
      Looks like you haven't placed any orders. Let's change that!
    </p>
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.location.href = '/shop'}
    >
      Start Shopping
    </Button>
  </div>
);

const OrderItem = React.memo(({ order, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden p-4"
    >
      <div
        className={`pl-3 ${order.isDelivered ? 'text-green-600' : 'text-orange-500'} text-sm font-medium flex items-center`}
      >
        {order.isDelivered
          ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`
          : 'Delivering in few minutes'}
      </div>

      <div className="pl-4 border-b-[1px] border-gray-400">
        <div className="flex flex-col">
        <div className="p-0">
            <div className="flex justify-between items-center">
              <div>

                <p className="text-xs text-gray text-black">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item |' : 'items |'}
                  <span>                  
                    ₹ {order.totalPrice.toFixed(2)}
                  </span>
                </p>

              </div>

              <ChevronRight className="text-gray-400" />
            </div>
          </div>
          {/* Images Section */}
          <div className="flex space-x-4 mb-3 ">
            {order.orderItems.slice(0, 3).map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={item.name}
                className="w-[3rem] h-[3rem] object-cover bg-gray-200 rounded-lg"
              />
            ))}
            {order.orderItems.length > 3 && (
              <div className="w-[2rem] h-[2rem] bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center text-sm font-bold">
                +{order.orderItems.length - 3}
              </div>
            )}
          </div>

          {/* Order Details Section */}
          
        </div>
      </div>
    </motion.div>
  );
});

const UserOrder = () => {
  const navigate = useNavigate();
  const [orderFilter, setOrderFilter] = useState('all');
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleRefetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
    refetch();
  }, [refetch]);

  // Filter orders based on selected filter
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];

    switch (orderFilter) {
      case 'delivering':
        return orders.filter(order => !order.isDelivered);
      case 'delivered':
        return orders.filter(order => order.isDelivered);
      default:
        return orders;
    }
  }, [orders, orderFilter]);

  const observerRef = useRef();
  const [visibleOrders, setVisibleOrders] = useState([]);

  useEffect(() => {
    if (filteredOrders) {
      setVisibleOrders(filteredOrders.slice(0, 5));
    }
  }, [filteredOrders]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleOrders.length < filteredOrders?.length) {
          setVisibleOrders(prev => [
            ...prev,
            ...filteredOrders.slice(prev.length, prev.length + 5)
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
  }, [visibleOrders, filteredOrders]);

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-6 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center p-4">
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{
              my: 0,
              color: '#1A1A1A',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          />
          <h1 className="text-xl text-gray-800">Orders</h1>
        </div>

        {/* Order Status Filters */}
        <div className="flex ml-5 text-gray-500 mb-4 space-x-4">
          <button
            onClick={() => setOrderFilter('all')}
            className={`pb-2 ${orderFilter === 'all' ? 'border-b-2 border-black text-sm' : 'text-gray-500'}`}
          >
            All
          </button>
          <button
            onClick={() => setOrderFilter('delivering')}
            className={`pb-2 ${orderFilter === 'delivering' ? 'border-b-2 border-black text-sm' : 'text-gray-500'}`}
          >
            Delivering
          </button>
          <button
            onClick={() => setOrderFilter('delivered')}
            className={`pb-2 ${orderFilter === 'delivered' ? 'border-b-2 border-black text-sm' : 'text-gray-500'}`}
          >
            Delivered
          </button>
        </div>

        <div className="">
          <AnimatePresence>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <div className="text-red-500 p-4">
                {error?.data?.error || error.error}
              </div>
            ) : (orders && orders.length === 0) ? (
              <EmptyState />
            ) : visibleOrders.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                No orders found for this filter
              </div>
            ) : (
              <>
                {visibleOrders.map((order) => (
                  <OrderItem
                    key={order._id}
                    order={order}
                    onClick={() => navigate(`/order/${order._id}`)}
                  />
                ))}
                {visibleOrders.length < filteredOrders?.length && (
                  <div ref={observerRef} className="h-8" />
                )}
                {visibleOrders.length === filteredOrders?.length && filteredOrders.length > 0 && (
                  <div className="text-center text-gray-500 p-4">
                    No more orders to show
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;