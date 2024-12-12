import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { OrderItemSkeleton } from './SkeletonLoader';
import Message from '../../../components/Message';

const OrderItems = ({ isLoading, orderItems }) => {
  const [showAllProducts, setShowAllProducts] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <OrderItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return <Message>Order is empty</Message>;
  }

  // Determine which items to display
  const displayItems = showAllProducts 
    ? orderItems 
    : orderItems.slice(0, 3);

  return (
    <div>
      <div className="text-md text-gray-800 mb-4">
        Order of {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
      </div>
      <div className="space-y-4">
        {displayItems.map((p, index) => (
          <div 
            key={index} 
            className="flex bg-[#cae6da4f] rounded-lg shadow-sm overflow-hidden p-2  transition-shadow duration-200"
          >
            {/* Left Section - Image and Heart */}
            <div className="relative w-[5.5rem] h-[5rem]">
              <div className="w-full h-full bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-1 right-1 p-1.5 bg-transparent rounded-full"
              >
                <FiHeart
                  size={16}
                  className="text-gray-400"
                />
              </button>
            </div>

            {/* Right Section - Details */}
            <div className="flex-1 ml-4 flex flex-col justify-between">
              <div>
                <Link 
                  to={`/product/${p.product}`} 
                  className=" text-md text-gray-900 mb-1 hover:text-green-800"
                >
                  {p?.name}
                </Link>
                <p className="text-xs text-gray-600 mb-2">{p?.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {p?.price?.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </span>
                
                <div className="flex items-center justify-center rounded-lg">
                  <span className="px-3 py-1 text-gray-800 text-xs min-w-[24px] text-center">
                    Qty: {p.qty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show all products link - only show if more than 3 items */}
      {orderItems.length > 3 && !showAllProducts && (
        <div className="text-center mt-4">
          <button 
            onClick={() => setShowAllProducts(true)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Show all the products
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderItems;