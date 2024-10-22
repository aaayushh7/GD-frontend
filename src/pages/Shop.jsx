import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchSubcategoriesByCategoryQuery } from "../redux/api/categoryApiSlice";
import { setProducts, setChecked } from "../redux/features/shop/shopSlice";
import { FaArrowLeft, FaSearch, FaTimes } from "react-icons/fa";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checked, radio } = useSelector((state) => state.shop);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const { data: filteredProducts, isLoading: isLoadingProducts } = useGetFilteredProductsQuery({ checked, radio });
  const { data: subcategories, isLoading: isLoadingSubcategories } = useFetchSubcategoriesByCategoryQuery(checked[0]);

  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    if (filteredProducts) {
      dispatch(setProducts(filteredProducts));
      updateDisplayedProducts(filteredProducts, selectedSubcategories, searchQuery);
    }
  }, [filteredProducts, dispatch]);

  useEffect(() => {
    if (filteredProducts) {
      updateDisplayedProducts(filteredProducts, selectedSubcategories, searchQuery);
    }
  }, [selectedSubcategories, searchQuery]);

  const updateDisplayedProducts = (products, subcats, query) => {
    let filtered = products;

    if (subcats.length > 0) {
      filtered = filtered.filter(product => subcats.includes(product.subcategory));
    }

    if (query) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setDisplayedProducts(filtered);
  };

  const handleBackClick = () => {
    dispatch(setChecked([]));
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleRemoveSubcategory = (subcategoryId) => {
    setSelectedSubcategories(prev => prev.filter(id => id !== subcategoryId));
  };

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

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#facc15] shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-yellow-700">Crave-Hub</h1>
            <div className="flex-grow mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full py-2 px-4 pr-10 rounded-full border-2 border-yellow-500 focus:outline-none focus:border-yellow-600 text-sm bg-white bg-opacity-50"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 mt-16">
        <div className="mb-6">
          {isLoadingProducts || isLoadingSubcategories ? (
            <div className="bg-gray-200 w-48 h-10 rounded-full animate-pulse"></div>
          ) : (
            <button
              onClick={handleBackClick}
              className="bg-white text-gray-800 border-[1px] border-gray-300 py-2 px-4 rounded-full flex items-center hover:bg-yellow-600 transition-colors duration-300 text-sm"
            >
              <FaArrowLeft className="mr-2" />
              Back to Categories
            </button>
          )}
        </div>

        {isLoadingSubcategories ? (
          <div className="mb-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded-full w-24"></div>
              ))}
            </div>
          </div>
        ) : (
          subcategories && subcategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-yellow-700 mb-3">Subcategories</h2>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    onClick={() => handleSubcategoryClick(subcategory._id)}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${
                      selectedSubcategories.includes(subcategory._id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {subcategory.name}
                    {selectedSubcategories.includes(subcategory._id) && (
                      <FaTimes
                        className="ml-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubcategory(subcategory._id);
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <AnimatePresence>
            {isLoadingProducts
              ? [...Array(8)].map((_, index) => (
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
              : displayedProducts.map((product) => (
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
        </div>
        
        {!isLoadingProducts && displayedProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found. Try adjusting your search or subcategory selection.
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;