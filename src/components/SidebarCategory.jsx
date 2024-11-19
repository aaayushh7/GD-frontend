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

      <div className="fixed left-0 top-[7.8rem] h-[calc(100vh-13rem)] w-[4.6rem] bg-[#FDF7E4] shadow-lg rounded-tr-2xl border border-[#afd1b2] rounded-br-2xl z-40">
        <div className="h-full overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          <div className="flex flex-col items-center space-y-7 mb-2">
            {categories.map((category) => (
              <div key={category._id} className="relative">
                {selectedCategory === category._id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute -left-1.5 w-1 mt-[0.30rem] h-12 rounded-full bg-yellow-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => onCategorySelect(category._id)}
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center 
                    ${
                      selectedCategory === category._id
                        ? 'border-2 border-yellow-500 shadow-lg'
                        : 'border border-gray-200 hover:border-yellow-300'
                    }
                    transition-all duration-200 bg-gray-100`}
                >
                  <img
                    src={category.image || '/api/placeholder/48/48'}
                    alt={category.name}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  <div className="absolute w-max bg-gray-800 text-gray-400 text-xs py-1 px-2 rounded-md 
                    left-16 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 whitespace-nowrap">
                    {category.name}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
