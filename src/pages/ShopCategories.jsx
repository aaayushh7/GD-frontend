// ShopCategories.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = {
  ShopCategory: () => (
    <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
  )
};

const ShopCategories = ({ categories, isCategoriesLoading, handleCategoryClick }) => {
  // Multiple sets of categories, each with 4 items
  const firstSet = categories?.slice(15, 24 );
  const secondSet = categories?.slice(24, 29);
  const thirdSet = categories?.slice(29, 32);
  const fourthSet = categories?.slice(32, 37);


  const renderCategorySection = (categorySet, sectionIndex) => (
  <div className="mb-8" key={`section-${sectionIndex}`}>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-md text-gray-700 w-full text-center tracking-wider p-3 font-semibold">SHOP YOUR THINGS</h2>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {isCategoriesLoading
        ? Array(4).fill(null).map((_, index) => (
          <SkeletonLoader.ShopCategory key={`skeleton-shop-${sectionIndex}-${index}`} />
        ))
        : categorySet?.map((category) => (
          <motion.div
            key={category._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category._id)}
            className="flex flex-col items-center"
          >
            <div className="w-[5rem] h-[5rem] rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all overflow-hidden">
              <img
                src={category.image || './src/assets/12.png'}
                alt={category.name}
                className="w-[5rem] h-[5rem] object-cover"
                onError={(e) => {
                  e.target.src = './src/assets/12.png';
                }}
              />
            </div>
            <h3 className="text-[12px] text-gray-700 text-center w-full mt-2 ">
  {category.name.length > 13 ? category.name.slice(0, 13) + '..' : category.name}
</h3>          </motion.div>
        ))}
    </div>
  </div>
);

const renderCategorySectionSecond = (categorySet, sectionIndex) => (
  <div className="mb-8 bg-gradient-to-r from-white via-red-50 to-white" key={`section-${sectionIndex}`}>
    <div className="flex justify-center text-red-500 text-sm items-center mb-4">
      <span className="flex-1 h-[1px] bg-gradient-to-l from-red-400 to-white mr-3"></span>      
      <span className="text-center tracking-wider font-semibold">BAKERY AND DAIRY</span>
      <span className="flex-1 h-[1px] bg-gradient-to-r from-red-400 to-white ml-3"></span>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {isCategoriesLoading
        ? Array(4).fill(null).map((_, index) => (
          <SkeletonLoader.ShopCategory key={`skeleton-shop-${sectionIndex}-${index}`} />
        ))
        : categorySet?.map((category) => (
          <motion.div
            key={category._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category._id)}
            className="flex flex-col items-center"
          >
            <div className="w-[5rem] h-[5rem] rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all overflow-hidden">
              <img
                src={category.image || './src/assets/12.png'}
                alt={category.name}
                className="w-[5rem] h-[5rem] object-cover"
                onError={(e) => {
                  e.target.src = './src/assets/12.png';
                }}
              />
            </div>
            <h3 className="text-[12px] text-gray-700 text-center w-full mt-2">
  {category.name.length > 15 ? category.name.slice(0, 15) + '...' : category.name}
</h3>          </motion.div>
        ))}
    </div>
  </div>
);
  
const renderCategorySectionThird = (categorySet, sectionIndex) => (
  <div className="mb-8 bg-gradient-to-r from-white via-green-50 to-white rounded-full" key={`section-${sectionIndex}`}>
    <div className="flex justify-center text-green-700 text-sm items-center mb-4">
      <span className="flex-1 h-[1px] bg-gradient-to-l from-green-600 to-white mr-3"></span>      
      <span className="text-center tracking-wider uppercase font-semibold">Eggs, Meats & Seafoods</span>
      <span className="flex-1 h-[1px] bg-gradient-to-r from-green-600 to-white ml-3"></span>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {isCategoriesLoading
        ? Array(4).fill(null).map((_, index) => (
          <SkeletonLoader.ShopCategory key={`skeleton-shop-${sectionIndex}-${index}`} />
        ))
        : categorySet?.map((category) => (
          <motion.div
            key={category._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category._id)}
            className="flex flex-col items-center"
          >
            <div className="w-[5rem] h-[5rem] rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all overflow-hidden">
              <img
                src={category.image || './src/assets/12.png'}
                alt={category.name}
                className="w-[5rem] h-[5rem] object-cover"
                onError={(e) => {
                  e.target.src = './src/assets/12.png';
                }}
              />
            </div>
            <h3 className="text-[12px] text-gray-700 text-center w-full mt-2">
  {category.name.length > 15 ? category.name.slice(0, 15) + '...' : category.name}
</h3>          </motion.div>
        ))}
    </div>
  </div>
);
const renderCategorySectionFourth = (categorySet, sectionIndex) => (
  <div className="mb-8 bg-gradient-to-r from-white via-orange-50 to-white" key={`section-${sectionIndex}`}>
    <div className="flex justify-center text-orange-500 text-sm items-center mb-4">
      <span className="flex-1 h-[1px] bg-gradient-to-l from-orange-600 to-white mr-3"></span>      
      <span className="text-center tracking-wider uppercase font-semibold">Pan Corner</span>
      <span className="flex-1 h-[1px] bg-gradient-to-r from-orange-600 to-white ml-3"></span>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {isCategoriesLoading
        ? Array(4).fill(null).map((_, index) => (
          <SkeletonLoader.ShopCategory key={`skeleton-shop-${sectionIndex}-${index}`} />
        ))
        : categorySet?.map((category) => (
          <motion.div
            key={category._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category._id)}
            className="flex flex-col items-center"
          >
            <div className="w-[5rem] h-[5rem] rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all overflow-hidden">
              <img
                src={category.image || './src/assets/12.png'}
                alt={category.name}
                className="w-[5rem] h-[5rem] object-cover"
                onError={(e) => {
                  e.target.src = './src/assets/12.png';
                }}
              />
            </div>
            <h3 className="text-[12px] text-gray-700 text-center w-full mt-2">
  {category.name.length > 15 ? category.name.slice(0, 15) + '...' : category.name}
</h3>          </motion.div>
        ))}
    </div>
  </div>
);

  return (
    <>
      {renderCategorySection(firstSet, 1)}
      {renderCategorySectionSecond(secondSet, 2)}
      {renderCategorySectionThird(thirdSet, 3)}
      {renderCategorySectionFourth(fourthSet, 4)}

    </>
  );
};

export default ShopCategories;