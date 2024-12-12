// src/components/PaymentStatus.jsx
import React from 'react';
import { 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle 
} from 'react-icons/fa';

const PaymentStatus = ({ 
  isPaid, 
  isShipped, 
  paidAt, 
  shippedAt, 
  isLoading, 
  paymentMethod 
}) => {
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

export default PaymentStatus;