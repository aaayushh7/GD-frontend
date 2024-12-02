import React from 'react';

const CouponForm = ({
  code,
  setCode,
  discount,
  setDiscount,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  buttonClass = "bg-amber-600 hover:bg-amber-700",
  deleteButtonClass = "bg-red-600 hover:bg-red-700",
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="coupon-code" className="block text-sm font-medium text-amber-800 mb-1">
            Coupon Code
          </label>
          <input
            id="coupon-code"
            type="text"
            className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-amber-800 mb-1">
            Discount (%)
          </label>
          <input
            id="discount"
            type="number"
            className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter discount percentage"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className={`${buttonClass} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200 ease-in-out`}
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className={`${deleteButtonClass} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out`}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CouponForm;