import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setChecked } from '../redux/features/shop/shopSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { FaSearch, FaTimes } from "react-icons/fa";
import ProductCard from "./Products/ProductCard";
import bucketLogo from '../assets/logobucket.png';
import RandomProducts from '../components/RandomProducts';
import bannerImage from '../assets/Banner.png';
import Ur from '../assets/UrLogo2.svg';
import ShopCategories from './ShopCategories';
import HeaderAddressModal from './User/HeaderAddress';

const SkeletonLoader = {
  Category: () => (
    <div className="flex flex-col items-center w-24">
      <div className="w-20 h-20 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
    </div>
  ),

  ShopCategory: () => (
    <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
  ),

  Product: () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[7.5rem] border border-gray-200 p-3 animate-pulse">
      <div className="flex">
        <div className="w-[60%] pr-2 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-[40%] flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [shouldFetchProducts, setShouldFetchProducts] = useState(false);
  const [showAllRegional, setShowAllRegional] = useState(true);
  const [activeTab, setActiveTab] = useState('Meal');

  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery();
  const { data: allProducts, isLoading: isLoadingProducts } = useAllProductsQuery(undefined, {
    skip: !shouldFetchProducts
  });

  React.useEffect(() => {
    if (allProducts && shouldFetchProducts) {
      updateDisplayedProducts(allProducts, searchQuery);
    }
  }, [allProducts, searchQuery, shouldFetchProducts]);

  const updateDisplayedProducts = (products, query) => {
    if (query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(products);
    }
  };

  const handleCategoryClick = (categoryId) => {
    dispatch(setChecked([categoryId]));
    navigate('/shop');
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShouldFetchProducts(true);
      setSearchQuery("");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderRegionalFoods = () => {
    if (!categories && !isCategoriesLoading) return null;

    const regionalCategories = showAllRegional
      ? categories?.slice(0, 15)
      : categories?.slice(0, 16);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm text-gray-600 tracking-wider mt-2 font-semibold">REGIONAL FOODS</h2>
        </div>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>
            {`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className={`grid grid-rows-2 grid-flow-col gap-4 ${showAllRegional ? 'grid-cols-3 grid-rows-4' : ''}`}
            style={{ minWidth: showAllRegional ? '100%' : 'auto' }}>
            {isCategoriesLoading
              ? Array(showAllRegional ? 12 : 8).fill(null).map((_, index) => (
                <SkeletonLoader.Category 
                    key={`skeleton-regional-${index}`}
                    className={`${!showAllRegional ? 'w-24' : ''}`}
                />
              ))
              : regionalCategories?.map((category) => (
                <motion.div
                  key={category._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`flex flex-col items-center ${!showAllRegional ? 'w-24' : ''}`}
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
                </motion.div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm text-gray-600 mt-9 flex items-center tracking-wider font-semibold">
            <span>YOU MIGHT ALSO LIKE </span>
            <span className="flex-1 h-[1px] bg-green-500 ml-2"></span>
          </h2>
          <RandomProducts count={3} />
        </div>
      </div>
    );
  };

  const renderShopCategories = () => {
    if (!categories && !isCategoriesLoading) return null;

    return (
      <ShopCategories
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        handleCategoryClick={handleCategoryClick}
      />
    );
  };

  const renderProducts = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {isLoadingProducts
            ? Array(8).fill(null).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SkeletonLoader.Product />
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
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full py-3 mb-[3rem] border-b border-gray-200 shadow-sm bg-[#FDF7E4]">
        <div className="flex items-center justify-center mb-3 mt-2">
          <HeaderAddressModal />
          <h1 className="text-2xl font-bold">
            <img
              src={bucketLogo}
              alt="Bucket Logo"
              className="h-10 w-auto bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent"
            />
          </h1>
        </div>
      </header>

      <div className="w-full flex items-center justify-center rounded-md">
        <div className="flex w-[80%] rounded-md text-sm bg-cream-100 border-[1px] border-[#afd1b2]">
          <button
            onClick={() => setActiveTab('Meal')}
            className={`flex-1 py-1 text-center rounded-md font-medium transition-all text-lg duration-200 ${
              activeTab === 'Meal'
                ? 'bg-[#1D3A1C] text-white rounded-md shadow-sm'
                : 'bg-[#FFF3E6] text-[#A5521C]'
            }`}
          >
            <span>
              <img src={Ur} alt="Ur Logo" className="inline-block mb-1 h-[22px] w-[22px]" />
            </span>
            Meal
          </button>
          <button
            onClick={() => setActiveTab('Mart')}
            className={`flex-1 py-1 text-center rounded-md font-medium transition-all text-lg duration-200 ${
              activeTab === 'Mart'
                ? 'bg-[#1D3A1C] text-white rounded-md shadow-sm'
                : 'bg-[#FFF3E6] text-[#A5521C]'
            }`}
          >
            <span>
              <img src={Ur} alt="Ur Logo" className="inline-block mb-1 h-[22px] w-[22px]" />
            </span>
            Mart
          </button>
        </div>
      </div>

      <div className="px-4 mb-6 mt-4">
        <div className="relative w-full">
          {isSearchExpanded ? (
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
                className="w-full pl-10 pr-4 py-1 rounded-xl border-[1px] bg-green-50 border-[#afd1b2] focus:border-gray-400 transition-colors"
              />
              <button
                onClick={toggleSearch}
                className="ml-2 p-2 rounded-full bg-green-500 text-white"
              >
                <FaTimes />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-1" />
              <input
                type="text"
                placeholder="What do you want to eat?"
                onClick={toggleSearch}
                className="w-full pl-10 pr-4 py-1 rounded-xl border-[1px] bg-green-50 border-[#afd1b2] focus:border-gray-400 transition-colors cursor-pointer"
                readOnly
              />
            </motion.div>
          )}
        </div>
      </div>

      {!isSearchExpanded && (
        <div className="flex justify-center mb-4">
          <div
            className="bg-fit bg-center rounded-md text-white"
            style={{
              backgroundImage: `url(${bannerImage})`,
              width: '92%',
              height: '9.4rem'
            }}
          />
        </div>
      )}

      <main className="px-4 pb-8">
        {isSearchExpanded ? (
          <>
            {renderProducts()}
            {!isLoadingProducts && allProducts && displayedProducts.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No products found. Try adjusting your search.
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 'Mart' && renderShopCategories()}
            {activeTab === 'Meal' && renderRegionalFoods()}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;