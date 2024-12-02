import React, { useState, useEffect } from 'react';
import { useAllProductsQuery } from "../redux/api/productApiSlice"
import ProductCard from "../pages/Products/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const RandomProducts = ({ count = 3 }) => {
  const { data: allProducts, isLoading, error } = useAllProductsQuery();
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Shuffle and select random products
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      setRandomProducts(selected);
    }
  }, [allProducts, count]);

  // Skeleton loader similar to the Shop component
  const SkeletonProductCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[7.5rem] border border-gray-200 p-3 animate-pulse">
      <div className="flex">
        <div className="w-[60%] pr-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-[40%] flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
      <AnimatePresence>
        {isLoading
          ? [...Array(count)].map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SkeletonProductCard />
              </motion.div>
            ))
          : randomProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard p={product} />
              </motion.div>
            ))}
      </AnimatePresence>

      {!isLoading && randomProducts.length === 0 && (
        <div className="col-span-full text-center text-gray-500 mt-8">
          No products found.
        </div>
      )}
    </div>
  );
};

export default RandomProducts;