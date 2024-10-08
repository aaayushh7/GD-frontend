import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const Loader = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-gray-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-200 rounded col-span-2"></div>
          <div className="h-2 bg-gray-200 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const Message = ({ children, variant }) => (
  <div className={`p-4 mb-4 rounded-lg ${variant === 'danger' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
    {children}
  </div>
);

// eslint-disable-next-line react/display-name
const OrderItem = React.memo(({ order }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 transform transition-all duration-300 hover:scale-105">
    <div className="p-4">
      <div className="flex items-center mb-2">
        <img
          src={order.orderItems[0].image}
          alt={order.user}
          className="w-16 h-16 object-cover rounded-full mr-4"
        />
        <div>
          <h3 className="font-bold text-lg">{order.orderItems[0].name}</h3>
          <p className="text-gray-600">Order ID: {order._id}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="font-bold text-xl text-yellow-500">${order.totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800'}`}>
            {order.isPaid ? 'Paid' : 'Pending'}
          </span>
          <span className={`mt-1 px-2 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800'}`}>
            {order.isDelivered ? 'Delivered' : 'Pending'}
          </span>
        </div>
      </div>
      <Link to={`/order/${order._id}`} className="block mt-4">
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full transition-colors duration-300">
          View Details
        </button>
      </Link>
    </div>
  </div>
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
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
        <button
          onClick={handleRefetch}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full transition-colors duration-300 transform hover:scale-105"
        >
          Refresh Orders
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))}
          {visibleOrders.length < orders?.length && (
            <div ref={observerRef} className="h-10" />
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrder;
