import React, { useEffect, useState, useRef } from "react";
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
import { FaMapMarkerAlt, FaPhone, FaMailBulk, FaGlobe, FaArrowRight, FaSave } from "react-icons/fa";

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

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [isPincodeValid, setIsPincodeValid] = useState(true);
  const [extraCharge, setExtraCharge] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSaveAddressButton, setShowSaveAddressButton] = useState(false);
  const [showSwipeToOrder, setShowSwipeToOrder] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const ballRef = useRef(null);

  const [saveAddress, { isLoading: isSavingAddress }] = useSaveAddressMutation();
  const { data: userAddress, isLoading: isLoadingAddress } = useGetUserAddressQuery();

  useEffect(() => {
    const checkSavedAddress = async () => {
      setIsCheckingAddress(true);
      if (userAddress) {
        console.log("User's saved address:", userAddress);
        dispatch(saveShippingAddress({
          address: userAddress.address || "",
          city: userAddress.city || "",
          postalCode: userAddress.postalCode || "",
          country: userAddress.country || "",
          extraCharge: userAddress.extraCharge || 0
        }));
        dispatch(savePaymentMethod("Pay on delivery")); // Default payment method
        setIsCheckingAddress(false);
        navigate("/placeorder");
      } else {
        setIsCheckingAddress(false);
        setAddress(userAddress?.address || "");
        setCity(userAddress?.city || "");
        setPostalCode(userAddress?.postalCode || "");
        setCountry(userAddress?.country || "");
        setExtraCharge(userAddress?.extraCharge || 0);
      }
    };

    checkSavedAddress();
  }, [userAddress, dispatch, navigate]);

  useEffect(() => {
    setShowSaveAddressButton(address && city && postalCode && country);
    setShowSwipeToOrder(showSaveAddressButton && paymentMethod);
  }, [address, city, postalCode, country, paymentMethod]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    dispatch(saveShippingAddress({ address, city, postalCode, country, extraCharge }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  const handleSaveAddress = async () => {
    try {
      await saveAddress({ address, city, postalCode, country, extraCharge }).unwrap();
      alert("Address saved successfully!");
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  const handlePostalCodeChange = (e) => {
    const newPostalCode = e.target.value;
    setPostalCode(newPostalCode);
    const isValid = validatePincode(newPostalCode);
    setIsPincodeValid(isValid);
    if (isValid) {
      const charge = calculateExtraCharge(newPostalCode);
      setExtraCharge(charge);
    } else {
      setExtraCharge(0);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const updateSliderPosition = (clientX) => {
    const slider = sliderRef.current;
    const ball = ballRef.current;
    if (!slider || !ball) return;

    const rect = slider.getBoundingClientRect();
    const ballWidth = ball.offsetWidth;
    const maxX = rect.width;
    let newX = clientX - rect.left - ballWidth / 2;
    newX = Math.max(0, Math.min(newX, maxX));

    const percentage = (newX / maxX) * 100;
    setSliderPosition(percentage);
  };

  const handleStart = (clientX) => {
    setIsDragging(true);
    updateSliderPosition(clientX);
  };

  const handleMove = (clientX) => {
    if (isDragging) {
      updateSliderPosition(clientX);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (sliderPosition >= 90) {
      submitHandler({ preventDefault: () => {} });
    } else {
      setSliderPosition(0);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  if (isCheckingAddress) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="text-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 animate-spin">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="8" strokeDasharray="70 30" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-amber-800 font-semibold text-lg">Checking for saved address in database...</p>
          <p className="mt-2 text-amber-600">Your delicious meal is just moments away!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 />
        <div className="mt-10 flex justify-center">
          <form onSubmit={submitHandler} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border-2 border-amber-500">
            <h1 className="text-3xl font-bold mb-6 text-amber-800 text-center">Shipping Details</h1>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-amber-500" />
                Address Line 1 :
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaPhone className="mr-2 text-amber-500" />
                Address Line 2:
              </label>
              <input
                type="tel"
                className="w-full p-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter Contact Number"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaMailBulk className="mr-2 text-amber-500" />
                Postal Code
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={handlePostalCodeChange}
              />
              {!isPincodeValid && postalCode && (
                <p className="text-red-500 text-sm mt-1">Invalid pincode. Must be in Karnataka, Andhra Pradesh, Kerala, Tamil Nadu.</p>
              )}
              {isPincodeValid && extraCharge > 0 && (
                <p className="text-amber-500 text-sm mt-1">Extra delivery charge of ₹{extraCharge} applies to this area (At the time of delivery)</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaGlobe className="mr-2 text-amber-500" />
                Contact No.
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            {showSaveAddressButton && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={isSavingAddress}
                  className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors flex items-center justify-center"
                >
                  <FaSave className="mr-2" />
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Payment Method</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    paymentMethod === "Pay on delivery"
                      ? "bg-yellow-400 text-black border border-black"
                      : "bg-white text-black border border-black"
                  } transition-colors`}
                  onClick={() => handlePaymentMethodSelect("Pay on delivery")}
                >
                  Pay on delivery
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    paymentMethod === "PayPal"
                      ? "bg-yellow-400 text-black border border-black"
                      : "bg-white text-black border border-black"
                  } transition-colors`}
                  onClick={() => handlePaymentMethodSelect("PayPal")}
                >
                  PayPal
                </button>
              </div>
            </div>

            {showSwipeToOrder && (
              <div className="mt-8">
                <div
                  ref={sliderRef}
                  className="relative h-16 bg-yellow-200 rounded-full overflow-hidden cursor-pointer select-none touch-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleEnd}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-yellow-600 font-medium">
                      Swipe to Place Order {extraCharge > 0 && `(+₹${extraCharge})`}
                    </span>
                  </div>
                  <div
                    ref={ballRef}
                    className="absolute top-1 left-1 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-md transition-transform duration-100 ease-out"
                    style={{ transform: `translateX(${sliderPosition}%)` }}
                  >
                    <FaArrowRight className="text-white text-xl" />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
