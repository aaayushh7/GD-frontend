import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { load } from "@cashfreepayments/cashfree-js";
import { useGetUserAddressesQuery } from "../../redux/api/addressApiSlice";
import { useCreateOrderMutation, useCashfreeOrderMutation, useValidateCouponMutation  } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FaTag, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentMethodSection } from "../User/AddressSection";
import {
  saveShippingAddress
} from "../../redux/features/cart/cartSlice";

const SimplifiedOrder = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: userAddress } = useGetUserAddressesQuery();


  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [cashfreeOrder] = useCashfreeOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();
  const [cashfreeError, setCashfreeError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState(null);
  const [displayedTotalPrice, setDisplayedTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [showPaymentComponent, setShowPaymentComponent] = useState(false);


  // Existing useEffect for total price
  useEffect(() => {
    const cartTotal = Number(cart.totalPrice) || 0;
    const discount = Number(couponDiscount) || 0;
    setDisplayedTotalPrice(Math.max(0, cartTotal - discount));
  }, [cart.totalPrice, couponDiscount]);

  // Initialize Cashfree
  useEffect(() => {
    const initCashfree = async () => {
      try {
        const cashfreeInstance = await load({ mode: "sandbox" });
        setCashfree(cashfreeInstance);
      } catch (error) {
        console.error('Error initializing Cashfree:', error);
      }
    };

    initCashfree();
  }, []);

  // Coupon handler remains the same
  const applyCouponHandler = async () => {
    try {
      const result = await validateCoupon({
        code: couponCode,
        userId: userInfo._id
      }).unwrap();

      if (result.valid) {
        const newDiscount = Number(result.discount) || 0;
        setCouponDiscount(newDiscount);
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

  // Handle payment for different payment methods
  const handlePayment = async (orderId) => {
    if (cart.paymentMethod === 'Pay on delivery') {
      return true;  // Directly return true for Pay on Delivery
    } else {
      return await handleCashfreePayment(orderId);
    }
  };

  // Cashfree payment method
  const handleCashfreePayment = async (orderId) => {
    

    
    if (!cashfree) {
      toast.error('Cashfree is not initialized yet');
      return false;
    }
    

    try {
      const createCashfreeOrder = await cashfreeOrder({
        orderId: orderId,
        paymentDetails: {
          orderAmount: displayedTotalPrice,
          customerName: cart.shippingAddress.fullName,
          customerEmail: cart.shippingAddress.email,
          customerPhone: cart.shippingAddress.phone,
          returnUrl: `${window.location.origin}/order/${orderId}?paymentSessionId=${cashfreeOrder.paymentSessionId}&paymentCompleted=true`,
          notifyUrl: `${window.location.origin}/api/cashfree/webhook`,
        }
      }).unwrap();

      if (createCashfreeOrder && createCashfreeOrder.paymentSessionId) {
        const checkoutOptions = {
          paymentSessionId: createCashfreeOrder.paymentSessionId,
          returnUrl: `${window.location.origin}/order/${orderId}?paymentSessionId=${createCashfreeOrder.paymentSessionId}&paymentCompleted=true`,
        };

        return new Promise((resolve) => {
          cashfree.checkout(checkoutOptions).then(function (result) {
            if (result.error) {
              console.error('Payment error:', result.error);
              toast.error(result.error.message || 'Payment failed');
              resolve(false);
            }
            if (result.redirect) {
              resolve(true);
            }
          });
        });
      } else {
        throw new Error('Invalid response from Cashfree');
      }
    } catch (error) {
      console.error('Cashfree payment error:', error);
      toast.error(error?.message || 'Failed to initiate payment');
      return false;
    }
  };

  // Place order handler
  const placeOrderHandler = async () => {
    setIsProcessing(true);
    
    // Find the default address or use the first address
    const defaultAddress = userAddress?.find(addr => addr.isDefault);
    const addressToUse = defaultAddress || (userAddress && userAddress[0]);
  
    if (!addressToUse) {
      toast.error('No address found. Please add an address.');
      setIsProcessing(false);
      return;
    }
  
    const preparedShippingAddress = {
      fullName: userInfo.name,
      address: addressToUse.address,
      city: addressToUse.city,
      postalCode: addressToUse.postalCode,
      country: addressToUse.country,
      email: userInfo.email,
      phone: addressToUse.phone || '' // Add a fallback
    };
    
    dispatch(saveShippingAddress(preparedShippingAddress));
  
    const requiredFields = ['address', 'city', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(
      field => !preparedShippingAddress[field] || preparedShippingAddress[field].trim() === ''
    );
  
    if (missingFields.length > 0) {
      toast.error(`Please complete the following address fields: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }
  
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: preparedShippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        couponDiscount: couponDiscount,
        couponCode: couponCode
      }).unwrap();
  
      if (!res || !res._id) {
        throw new Error('Order creation failed, no order ID returned.');
      }
  
      const paymentSuccess = await handlePayment(res._id);
  
      if (paymentSuccess) {
        dispatch(clearCartItems());
        window.location.href = `/order/${res._id}`;
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while processing your order';
      if (error.response?.data?.message) {
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

  // Rest of the component remains the same as in the original implementation
  return (
    <div className="bg-white mb-20 pt-8 text-black">
      <div className="">
        <div className="bg-white">
          {/* Payment Method Section */}
          <div className="mb-0 p-4 bg-gradient-to-r w-full from-white to-[#d2e9df]">
            <div className="flex items-center">
              <span className="text-md text-black">Payment Method:</span>
              <span className="ml-2 text-md text-green-800">{cart.paymentMethod}</span>
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-r from-[#fee7d7] to-white">
            <div
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center text-md pl-4 mb-9 cursor-pointer"
            >
              <span>Total Amount:</span>
              <div className="flex items-center text-md font-semibold">
                <span>₹{displayedTotalPrice.toFixed(2)}</span>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  <FaChevronDown className="text-gray-500 pr-3 " size={20}  />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 bg-gradient-to-r from-[#fee7d7] to-white p-4 rounded-md">
                    <div className="flex text-sm justify-between">
                      <span>Items Total:</span>
                      <span>₹{Number(cart.itemsPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex text-sm justify-between">
                      <span>Delivery Fee:</span>
                      <span>₹{Number(cart.shippingPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex text-sm justify-between">
                      <span>Tax:</span>
                      <span>₹{Number(cart.taxPrice).toFixed(2)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Coupon Discount:</span>
                        <span>-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-sm">
                        <span>Final Total:</span>
                        <span>₹{displayedTotalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Coupon Section */}
          <div className="mb-[6rem] px-3">
            <div className="flex items-center">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-grow px-4 py-2 border-dashed border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              />
              <button
                onClick={applyCouponHandler}
                className="bg-green-700 hover:bg-yellow-600 text-white items-center justify-center flex px-4 py-2 rounded-r-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <FaTag className="inline-block mr-2" /> Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
          </div>

          {/* Error handling remains the same */}
          {error && <p className="text-red-500 mt-4">{error.data.message}</p>}
          {cashfreeError && <p className="text-red-500 mt-4">{cashfreeError}</p>}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-100 to-white border-t-2 border-dashed border-gray-200 z-50">
        <div className="container mx-auto max-w-4xl px-4 relative">
          <AnimatePresence>
            {showPaymentComponent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-full left-0 right-0 rounded-t-lg z-50"
              >
                <PaymentMethodSection
                  onClose={() => setShowPaymentComponent(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between py-4">
            {/* Total Price Section */}
            <div className="flex-grow mr-4 relative">
              <div
                onClick={() => setShowPaymentComponent(!showPaymentComponent)}
                className="flex-col items-center cursor-pointer"
              >
                <span className="text-[12px] mr-2 flex items-center text-orange-600">
                  Pay Using
                  <FaChevronDown
                    className="text-[7px] inline-block transition-transform duration-300 ease-in-out"
                    style={{
                      transform: showPaymentComponent ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}

                  />
                </span>
                <span className="text-lg">₹{displayedTotalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              type="button"
              className={`py-3 px-12 rounded-full flex items-center justify-center 
              ${cart.cartItems.length === 0 || isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"} 
              text-white text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
              disabled={cart.cartItems.length === 0 || isProcessing}
              onClick={placeOrderHandler}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-5 w-5 border-t-2 border-b-2 border-white  mr-3"
                  ></motion.div>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedOrder;