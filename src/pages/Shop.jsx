import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchSubcategoriesByCategoryQuery, useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setProducts, setChecked } from "../redux/features/shop/shopSlice";
import { FaSearch, FaTimes, FaUser } from "react-icons/fa";
import ProductCard from "./Products/ProductCard";
import CategorySidebar from "../components/SidebarCategory";
import bucketLogo from '../assets/logobucket.png';
import { ChevronLeft } from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checked, radio } = useSelector((state) => state.shop);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const { data: categories } = useFetchCategoriesQuery();

  const {
    data: filteredProducts,
    isLoading: isLoadingProducts
  } = useGetFilteredProductsQuery({
    checked,
    radio
  });

  const {
    data: subcategories,
    isLoading: isLoadingSubcategories
  } = useFetchSubcategoriesByCategoryQuery(
    checked[0],
    { skip: !checked[0] }
  );

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

  const SubcategorySkeletonLoader = () => (
    <div className="mb-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-8 bg-gray-200 rounded-full w-24"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b border-gray-200 shadow-sm bg-[#FDF7E4]">
        <div className="flex items-center justify-between mb-1 mt-2">
          <div>
            {checked[0] && (
              <button
                onClick={handleBackClick}
                className="py-2 px-1 text-sm"
              >
                <ChevronLeft className="text-[#222]" />
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold">
            <img
              src={bucketLogo}
              alt="Bucket Logo"
              className="h-8 w-auto bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent"
            />
          </h1>
          <FaUser className="text-xl cursor-pointer text-green-800" />
        </div>
      </header>

      <div className="fixed top-[4.3rem] pt-[1.2rem] left-0 right-0 z-50 px-1 mb-2 bg-white ">
        <div className="relative w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="What do you want to eat?"
              className="w-full pl-10 pr-4 py-1 rounded-xl border-[1px] border-[#afd1b2] bg-white focus:border-gray-400 transition-colors"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <CategorySidebar
        categories={categories || []}
        selectedCategory={checked[0]}
        onCategorySelect={(categoryId) => dispatch(setChecked([categoryId]))}
      />

      <main className="container mx-auto px-4 py-4 pt-32 pl-[6rem]">
        {isLoadingSubcategories ? (
          <SubcategorySkeletonLoader />
        ) : (
          subcategories && subcategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-yellow-700 mb-3">Subcategories</h2>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    onClick={() => handleSubcategoryClick(subcategory._id)}
                    className={`px-4 py-1 rounded-full text-xs flex items-center ${selectedSubcategories.includes(subcategory._id)
                        ? 'bg-[#5ec466] text-white'
                        : 'bg-transparent text-gray-800 border border-[#afd1b2]'
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
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