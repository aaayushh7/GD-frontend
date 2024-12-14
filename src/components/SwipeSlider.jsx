import React, { useState, useEffect } from 'react';

const SwipeSlider = ({ isVisible, onTouchStart, onTouchMove, onTouchEnd }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000); // Hide tooltip after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  if (!isVisible) return null;

  return (
    <div className="relative">
      {showTooltip && (
        <div className="absolute -top-12 left-0 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap">
          double tap to close
          <div className="absolute -bottom-1 left-[73%] transform -translate-x-1/2 w-2 h-2 bg-black bg-opacity-75 rotate-45"></div>
        </div>
      )}
      <div
        className="bg-green-700 border-2 border-white text-white w-[45px] rounded-full flex items-center h-[95px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-col pl-[15px] space-y-[-1.2rem] animate-bounce">
          <div className="h-3 w-3 border-r-2 border-b-2 border-white transform rotate-45"></div>
          <div className="h-3 w-3 border-r-2 border-b-2 border-white transform rotate-45 opacity-70"></div>
          <div className="h-3 w-3 border-r-2 border-b-2 border-white transform rotate-45 opacity-40"></div>
          <div className="h-3 w-3 border-r-2 border-b-2 border-white transform rotate-45 opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SwipeSlider;