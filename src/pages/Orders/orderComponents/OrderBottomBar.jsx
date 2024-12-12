// src/components/OrderBottomBar.jsx
import React from 'react';
import { 
  FaCreditCard, 
  FaTruck, 
  FaCheckCircle 
} from 'react-icons/fa';

const OrderBottomBar = ({
  order,
  userInfo,
  showOrderInfo,
  toggleOrderInfo,
  handlePayment,
  shipHandler,
  deliverHandler,
  loadingPay,
  loadingShip,
  loadingDeliver
}) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white rounded-lg shadow-md">
      <div className="max-w-3xl mx-auto">
        <div 
          className={`transition-all duration-300 ease-in-out overflow-auto rounded-xl ${
            showOrderInfo ? 'max-h-96' : 'max-h-0'
          }`}
        >
          
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
  );
};

export default OrderBottomBar;