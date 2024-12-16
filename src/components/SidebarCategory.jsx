import React from 'react';
import { motion } from 'framer-motion';

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <>
      <style>
        {`
          .custom-scrollbar {
            scrollbar-color: transparent transparent; /* Thumb and track colors */
            scrollbar-width: thin; /* Thin scrollbar */
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 3px; /* Scrollbar width */
            position: absolute; /* Ensure scrollbar doesn't take extra space */
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent; /* Track background color */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: green; /* Thumb color */
            border-radius: 4px; /* No rounded corners */
            height: 60%; /* Makes the thumb smaller to be centered */
          }

          /* Centering the scrollbar */
          .custom-scrollbar::-webkit-scrollbar-thumb {
            transform: translateY(55%); /* Centers the thumb */
          }
        `}
      </style>

      <div className="fixed left-0 top-[8rem] h-[calc(100vh-13rem)] w-[6rem] bg-white z-10">
        <div className="h-full overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          <div className="flex flex-col items-center space-y-7 mb-2">
            {categories.map((category) => (
              <div key={category._id} className="relative flex flex-col items-center">
                {selectedCategory === category._id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute -left-2 w-1 mt-[0.20rem] h-[4.4rem] rounded-full bg-yellow-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => onCategorySelect(category._id)}
                  className={`relative w-[4.5rem] h-[4.5rem] mb-1 rounded-md flex items-center justify-center 
                    transition-all duration-200 bg-gray-100`}
                >
                  <img
                    src={category.image || '/api/placeholder/48/48'}
                    alt={category.name}
                    className="w-[4.5rem] h-[4.5rem] object-cover rounded-md"
                  />
                </button>
                <div className="text-xs text-gray-400 text-center w-full mt-1">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;