// src/components/OrderSummary.jsx
import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { SkeletonLoader } from './SkeletonLoader';

const OrderSummary = ({ isLoading, order }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader height="h-6" />
      </div>
    );
  }

  return (
    <>
        <div className="space-y-2 text-gray-700 mt-4 text-sm px-2">
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
    </>
  );
};

export default OrderSummary;