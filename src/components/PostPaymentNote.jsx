import React from 'react';
import { FaCamera, FaInfoCircle } from 'react-icons/fa';

const PostPaymentNote = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaInfoCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            For your safety, please take a screenshot of this order confirmation.
          </p>
          <p className="mt-2 text-sm text-blue-600">
            <FaCamera className="inline mr-1" />
            This can be useful for quick reference or in case of any issues with your delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPaymentNote;