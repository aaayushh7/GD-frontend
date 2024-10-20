import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import {
  useSaveAddressMutation,
  useGetUserAddressQuery,
} from "../../redux/api/addressApiSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaMapMarkerAlt, FaPhone, FaMailBulk, FaGlobe, FaSave, FaUtensils, FaCheck } from "react-icons/fa";

const validatePincode = (pincode) => {
  const num = parseInt(pincode, 10);
  return (
    (num >= 510000 && num <= 539999) ||
    (num >= 560000 && num <= 669999) ||
    (num >= 670000 && num <= 699999)
  );
};

const calculateExtraCharge = (pincode) => {
  const num = parseInt(pincode, 10);
  if ((num >= 510000 && num <= 539999) || (num >= 560000 && num <= 599999) || (num > 669999 && num <= 699999)) {
    return 150;
  }
  return 0;
};

const InputField = React.memo(({ icon: Icon, label, ...props }) => (
  <div className="relative mb-6 group">
    <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center transition-colors group-hover:text-yellow-600">
      <Icon className="mr-2 text-yellow-500" />
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3 border-2 border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ease-in-out bg-white hover:border-yellow-400"
    />
  </div>
));

const AnimatedOrderButton = React.memo(({ onClick, extraCharge, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    onClick();
    setTimeout(() => setIsClicked(false), 2000);
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isClicked}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full h-16 relative overflow-hidden
        rounded-lg font-bold text-lg
        transition-all duration-300 ease-in-out
        transform hover:scale-102
        ${isClicked ? 'bg-green-500' : 'bg-yellow-400 hover:bg-yellow-500'}
        ${isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
      `}
    >
      <div className={`
        absolute inset-0 flex items-center justify-center
        transition-transform duration-500
        ${isClicked ? 'transform -translate-y-full' : 'transform translate-y-0'}
      `}>
        <div className="flex items-center space-x-2">
          <FaUtensils className={`transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
          <span>Place Order {extraCharge > 0 ? `(+₹${extraCharge})` : ''}</span>
        </div>
      </div>
      
      <div className={`
        absolute inset-0 flex items-center justify-center
        text-white transition-transform duration-500
        ${isClicked ? 'transform translate-y-0' : 'transform translate-y-full'}
      `}>
        <div className="flex items-center space-x-2">
          <FaCheck className="animate-bounce" />
          <span>Order Placed!</span>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-400">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
        </div>
      )}
    </button>
  );
});

const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center h-screen bg-white">
    <div className="relative w-32 h-32 animate-pulse">
      <div className="absolute inset-0 animate-spin">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" strokeDasharray="70 30">
            <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-yellow-400 rounded-full animate-bounce" />
      </div>
    </div>
    <div className="ml-4 text-center">
      <p className="text-yellow-800 font-semibold text-lg animate-pulse">Loading your details...</p>
      <p className="mt-2 text-yellow-600">Your delicious meal is getting closer!</p>
    </div>
  </div>
));

const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const [formState, setFormState] = useState({
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    postalCode: shippingAddress.postalCode || "",
    country: shippingAddress.country || "",
    paymentMethod: "",
    isPincodeValid: true,
    extraCharge: 0,
  });

  const [showSaveAddressButton, setShowSaveAddressButton] = useState(false);
  const [showOrderButton, setShowOrderButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saveAddress, { isLoading: isSavingAddress }] = useSaveAddressMutation();
  const { data: userAddress, isLoading: isLoadingAddress, isSuccess } = useGetUserAddressQuery();

  useEffect(() => {
    if (isSuccess && userAddress) {
      dispatch(saveShippingAddress({
        address: userAddress.address || "",
        city: userAddress.city || "",
        postalCode: userAddress.postalCode || "",
        country: userAddress.country || "",
        extraCharge: userAddress.extraCharge || 0
      }));
      dispatch(savePaymentMethod("Pay on delivery"));
      navigate("/placeorder");
    } else if (isSuccess) {
      setFormState(prevState => ({
        ...prevState,
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        country: shippingAddress.country || "",
        extraCharge: shippingAddress.extraCharge || 0,
      }));
    }
  }, [userAddress, isSuccess, dispatch, navigate, shippingAddress]);

  useEffect(() => {
    const { address, city, postalCode, country, paymentMethod } = formState;
    setShowSaveAddressButton(address && city && postalCode && country);
    setShowOrderButton(showSaveAddressButton && paymentMethod);
  }, [formState, showSaveAddressButton]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState(prevState => {
      const newState = { ...prevState, [name]: value };
      if (name === 'postalCode') {
        const isValid = validatePincode(value);
        const charge = isValid ? calculateExtraCharge(value) : 0;
        return { ...newState, isPincodeValid: isValid, extraCharge: charge };
      }
      return newState;
    });
  }, []);

  const submitHandler = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!formState.paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setIsSubmitting(true);
    const { address, city, postalCode, country, extraCharge, paymentMethod } = formState;
    dispatch(saveShippingAddress({ address, city, postalCode, country, extraCharge }));
    dispatch(savePaymentMethod(paymentMethod));
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/placeorder");
    }, 2000);
  }, [formState, dispatch, navigate]);

  const handleSaveAddress = useCallback(async () => {
    try {
      const { address, city, postalCode, country, extraCharge } = formState;
      await saveAddress({ address, city, postalCode, country, extraCharge }).unwrap();
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg transform transition-all duration-500 ease-in-out';
      successToast.textContent = 'Address saved successfully!';
      document.body.appendChild(successToast);
      setTimeout(() => {
        successToast.style.opacity = '0';
        setTimeout(() => successToast.remove(), 500);
      }, 2000);
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  }, [formState, saveAddress]);

  const paymentMethods = useMemo(() => ["Pay on delivery", "PayPal"], []);

  if (isLoadingAddress || isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white min-h-screen py-12 transition-all duration-300">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 />
        <div className="mt-10 flex justify-center">
          <form onSubmit={submitHandler} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border-2 border-yellow-400 transform transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl font-bold mb-8 text-yellow-800 text-center">
              Shipping Details
            </h1>

            <InputField
              icon={FaMapMarkerAlt}
              label="Address Line 1"
              type="text"
              name="address"
              placeholder="Enter address"
              value={formState.address}
              required
              onChange={handleInputChange}
            />

            <InputField
              icon={FaPhone}
              label="Address Line 2"
              type="tel"
              name="city"
              placeholder="Enter Contact Number"
              value={formState.city}
              required
              onChange={handleInputChange}
            />

            <InputField
              icon={FaMailBulk}
              label="Postal Code"
              type="text"
              name="postalCode"
              placeholder="Enter postal code"
              value={formState.postalCode}
              required
              onChange={handleInputChange}
              className={`w-full p-3 border-2 rounded-md transition-all duration-200 ease-in-out ${
                !formState.isPincodeValid && formState.postalCode
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-yellow-300 focus:ring-yellow-500'
              }`}
            />

            {!formState.isPincodeValid && formState.postalCode && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">
                Invalid pincode. Must be in Karnataka, Andhra Pradesh, Kerala, Tamil Nadu.
              </p>
            )}
            
            {formState.isPincodeValid && formState.extraCharge > 0 && (
              <p className="text-yellow-600 text-sm mt-1 animate-fade-in">
                Extra delivery charge of ₹{formState.extraCharge} applies to this area
              </p>
            )}

            <InputField
              icon={FaGlobe}
              label="Contact No."
              type="text"
              name="country"
              placeholder="Enter country"
              value={formState.country}
              required
              onChange={handleInputChange}
            />

            {showSaveAddressButton && (
              <div className="mb-6 transform transition-all duration-300 hover:scale-102">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={isSavingAddress}
                  className="w-full bg-yellow-400 text-black py-3 px-4 rounded-md hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="mr-2" />
                  {isSavingAddress ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>Saving...
                    </span>
                  ) : (
                    "Save Address"
                  )}
                </button>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-800 text-sm font-bold mb-2">Payment Method</label>
              <div className="flex space-x-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-102 ${
                      formState.paymentMethod === method
                        ? "bg-yellow-400 text-black border-2 border-black shadow-md"
                        : "bg-white text-black border-2 border-yellow-400 hover:border-yellow-500"
                    }`}
                    onClick={() => setFormState(prev => ({ ...prev, paymentMethod: method }))}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {showOrderButton && (
              <div className="mt-8">
                <AnimatedOrderButton 
                  onClick={submitHandler}
                  extraCharge={formState.extraCharge}
                  isLoading={isSubmitting}
                />
              </div>
            )}

            <style jsx>{`
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
              }
              
              .hover\:scale-102:hover {
                transform: scale(1.02);
              }
              
              input:focus {
                transform: translateY(-1px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              
              .input-focus-ring {
                transition: all 0.2s ease-in-out;
              }
              
              .input-focus-ring:focus-within {
                transform: translateY(-1px);
              }

              @keyframes pulse-shadow {
                0% {
                  box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
                }
                70% {
                  box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
                }
              }

              .animate-pulse-shadow {
                animation: pulse-shadow 2s infinite;
              }
            `}</style>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Shipping);