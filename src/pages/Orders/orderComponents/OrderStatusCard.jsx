import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';


const OrderStatusCard = ({ 
  order, 
  isPaid, 
  isShipped, 
  isDelivered, 
  createdAt, 
  orderId,
  address,
  phoneNumber,
  userInfo // New prop added
}) => {
  // [Previous calculation methods remain the same as in previous version]
  const calculateInitialProgress = () => {
    let progress = 0;
    if (isPaid) progress += 25;
    if (isShipped) progress += 25;
    if (isDelivered) progress += 25;
    return progress;
  };

  const calculateRemainingTime = () => {
    const orderCreatedAt = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - orderCreatedAt;
    const totalOrderTime = 25 * 60 * 1000; // 25 minutes in milliseconds
    
    const remainingTime = Math.max(0, Math.floor((totalOrderTime - elapsedTime) / 1000));
    return remainingTime;
  };

  const calculateAutoProgress = () => {
    const orderCreatedAt = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - orderCreatedAt;
    const totalOrderTime = 25 * 60 * 1000;
    
    const autoProgress = Math.min(100, Math.floor((elapsedTime / totalOrderTime) * 100));
    return autoProgress;
  };

  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem(`order-progress-${orderId}`);
    
    if (storedProgress) {
      return Math.max(
        calculateInitialProgress(), 
        parseInt(storedProgress)
      );
    }
    
    return calculateInitialProgress();
  });

  const [orderStatus, setOrderStatus] = useState({
    isPaid,
    isShipped,
    isDelivered
  });

  const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime);

  useEffect(() => {
    setOrderStatus({
      isPaid,
      isShipped,
      isDelivered
    });

    let currentProgress = calculateInitialProgress();
    const autoProgress = calculateAutoProgress();
    currentProgress = Math.max(currentProgress, autoProgress);
    
    setProgress(Math.min(currentProgress, 100));
    localStorage.setItem(`order-progress-${orderId}`, currentProgress.toString());

    const timer = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setTimeRemaining(newRemainingTime);

      const newAutoProgress = calculateAutoProgress();
      const updatedProgress = Math.max(
        calculateInitialProgress(), 
        newAutoProgress
      );
      
      setProgress(Math.min(updatedProgress, 100));
      localStorage.setItem(`order-progress-${orderId}`, updatedProgress.toString());

      if (newRemainingTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, createdAt, isPaid, isShipped, isDelivered]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modify handleCall to use the appropriate phone number
  const handleCall = () => {
    // If userInfo is provided and is an admin, use original phoneNumber
    // Otherwise, use the default number
    const callNumber = userInfo?.isAdmin ? phoneNumber : '6306500300';
    
    if (callNumber) {
      window.location.href = `tel:${callNumber}`;
    }
  };

  const orderPlacedAt = formatDate(createdAt);
  const expectedDeliveryTime = new Date(new Date(createdAt).getTime() + 25 * 60 * 1000);
  const formattedExpectedDelivery = formatDate(expectedDeliveryTime);

  return (
    <div className="p-4 mt-14 text-sm text-black relative">
      {/* Progress Container */}
      <div className="relative w-full mb-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-[2px] relative">
          <div 
            className="bg-orange-400 h-[2px] rounded-full absolute" 
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Left Dot */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 
            bg-black border-2 border-white w-3 h-3 rounded-full">
            <div className="absolute -top-9 left-0">
              <span className="text-xs text-gray-600 block whitespace-nowrap">Confirmed Order</span>
              <span className="text-[9px] text-orange-500 block">{orderPlacedAt}</span>
            </div>
          </div>
          
          {/* Right Dot */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 
            bg-white border-2 border-black w-3 h-3 rounded-full">
            <div className="absolute -top-9 right-0">
              <span className="text-xs text-gray-600 block whitespace-nowrap">Estimated Order</span>
              <span className="text-[9px] text-orange-500 block">{formattedExpectedDelivery}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Delivery in</span>
          <span className="text-orange-500">
            {timeRemaining > 0 ? formatTime(timeRemaining) : 'Completed'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-green-600">Address:</span>
          <span className="text-left text-xs w-2/3">
            {address || 'No address provided'}
          </span>
          {(phoneNumber || userInfo) && (
              <button 
                onClick={handleCall}
                className="text-green-600 h-10 w-10 border-dashed border border-green-400 rounded-full p-[10px]"
              >
                <Phone size={16} />
              </button>
            )}
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Status</span>
          <span>
            {orderStatus.isDelivered 
              ? 'Delivered' 
              : orderStatus.isShipped 
                ? 'Shipped' 
                : orderStatus.isPaid 
                  ? 'Confirmed' 
                  : 'Processing'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Order ID</span>
          <span>{orderId?.slice(-8)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusCard;