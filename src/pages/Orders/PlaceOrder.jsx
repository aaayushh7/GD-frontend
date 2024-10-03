import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation, useCashfreeOrderMutation, useValidateCouponMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FaShoppingBag, FaTruck, FaMoneyBillWave, FaCalculator, FaTag, FaChevronDown, FaChevronUp } from "react-icons/fa";

const PlaceOrder = () => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [cashfreeOrder] = useCashfreeOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();
  const [cashfreeError, setCashfreeError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState(null);
  const [displayedTotalPrice, setDisplayedTotalPrice] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setIsPageLoading(false);
    };
    loadPage();

    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  useEffect(() => {
    const newTotalPrice = Number(cart.totalPrice) - Number(couponDiscount);
    setDisplayedTotalPrice(isNaN(newTotalPrice) ? 0 : newTotalPrice);
  }, [cart.totalPrice, couponDiscount]);

  const applyCouponHandler = async () => {
    try {
      const result = await validateCoupon({
        code: couponCode,
        userId: userInfo._id
      }).unwrap();
      
      if (result.valid) {
        const newDiscount = Number(result.discount);
        setCouponDiscount(newDiscount);
        setDisplayedTotalPrice(Number(cart.totalPrice) - newDiscount);
        setCouponError(null);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError(result.message || "Invalid coupon code");
        toast.error(result.message || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err.data?.message || "Error validating coupon");
      toast.error(err.data?.message || "Error validating coupon");
    }
  };

  const placeOrderHandler = async () => {
    setIsProcessing(true);
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: displayedTotalPrice,
        couponDiscount: couponDiscount,
        couponCode: couponCode
      }).unwrap();
  
      if (!res || !res._id) {
        throw new Error('Order creation failed, no order ID returned.');
      }
  
      const createCashfreeOrder = await cashfreeOrder({
        orderId: res._id,
        paymentDetails: {
          orderAmount: displayedTotalPrice,
          customerName: cart.shippingAddress.fullName,
          customerEmail: cart.shippingAddress.email,
          customerPhone: cart.shippingAddress.phone,
          returnUrl: `${window.location.origin}/payment-success?order_id=${res._id}`,
          notifyUrl: `${window.location.origin}/api/cashfree/webhook`,
        }
      }).unwrap();

      if (createCashfreeOrder && createCashfreeOrder.returnUrl) {
        dispatch(clearCartItems());
        
        const redirectUrl = `${createCashfreeOrder.returnUrl}?paymentSessionId=${createCashfreeOrder.paymentSessionId}&cfOrder=${createCashfreeOrder.cforder}`;
        window.location.href = redirectUrl;
      } else {
        throw new Error('Invalid response from Cashfree');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while processing your order';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setCashfreeError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 step3 />

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Place Order</h1>

          {cart.cartItems.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 text-center mb-5">
              <FaShoppingBag className="text-yellow-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add items to your cart to place an order.</p>
              <Link to="/" className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-lg mb-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  {/* Table content here */}
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-white p-6 rounded-lg shadow-lg border border-black mb-6">
                    <h2 className="text-xl font-semibold text-black flex items-center">
                      <FaTruck className="mr-2 text-yellow-500" /> Shipping
                    </h2>
                    <p className="mt-3 text-black">
                      <strong>Address:</strong> 
                      <span className="text-gray-600"> {cart.shippingAddress.address}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.city}, {cart.shippingAddress.country}</span>
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg border border-black">
                    <h2 className="text-xl font-semibold text-black flex items-center">
                      <FaMoneyBillWave className="mr-2 text-yellow-500" /> Payment Method
                    </h2>
                    <p className="mt-3 text-black">
                      <strong>Method:</strong> 
                      <span className="text-gray-600"> {cart.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border border-black">
      <h2 className="text-xl font-semibold text-black flex items-center">
        <FaShoppingBag className="mr-2 text-yellow-500" /> Order Summary
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-black">
        <li className="flex justify-between font-bold text-gray-800 border-b border-gray-300 pb-3">
          <span>Total:</span>
          <span>₹{displayedTotalPrice.toFixed(2)}</span>
        </li>
        <li>
          <button
            onClick={toggleDetails}
            className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors duration-300 p-2 rounded-md"
          >
            <span>View Details</span>
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </li>
        {showDetails && (
          <>
            <li className="flex justify-between">
              <span className="text-gray-600">Items:</span>
              <span className="font-medium text-black">₹{cart.itemsPrice}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-black">₹{cart.shippingPrice}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium text-black">₹{cart.taxPrice}</span>
            </li>
            {couponDiscount > 0 && (
              <li className="flex justify-between text-green-600">
                <span>Coupon Discount:</span>
                <span>-₹{couponDiscount.toFixed(2)}</span>
              </li>
            )}
          </>
        )}
      </ul>
      <div className="mt-4">
        <div className="flex items-center">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={applyCouponHandler}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r-lg transition duration-300"
          >
            <FaTag className="inline-block mr-2" /> Apply
          </button>
        </div>
        {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
      </div>
    </div>
              </div>

              {error && <Message variant="danger">{error.data.message}</Message>}

              <button
                type="button"
                className={`mt-8 py-3 px-6 rounded-lg w-full flex items-center justify-center 
                  ${cart.cartItems.length === 0 || isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 transition duration-300"} 
                  text-white shadow-lg`}
                disabled={cart.cartItems.length === 0 || isProcessing}
                onClick={placeOrderHandler}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCalculator className="mr-2" /> Place Order
                  </>
                )}
              </button>

              {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;