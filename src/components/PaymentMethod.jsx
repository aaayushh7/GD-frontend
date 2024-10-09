import React from 'react';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const PaymentMethodInfo = ({ paymentMethod, isPaid }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
      <div className="flex items-center space-x-2">
        {paymentMethod === 'Pay on Delivery' ? (
          <FaMoneyBillWave className="text-green-500" />
        ) : (
          <FaCreditCard className="text-blue-500" />
        )}
        <span className="text-gray-700">{paymentMethod}</span>
      </div>
      {isPaid && (
        <p className="text-green-600 mt-2">Payment completed</p>
      )}
    </div>
  );
};

export default PaymentMethodInfo;