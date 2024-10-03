import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setChecked } from '../redux/features/shop/shopSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { FaSearch, FaTimes } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import imagePlaceholder from '../assets/12.png';
import ProductCard from "./Products/ProductCard";
import { useCheckLocationMutation } from '../redux/api/apiSlice';


const LocationCheck = ({ status }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-yellow-200 to-yellow-500">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-full p-8 shadow-lg"
    >
      <MdLocationOn className="text-8xl text-red-500" />
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 text-3xl font-bold text-white text-center"
    >
      {status === 'checking' ? 'Checking your location...' : 'Location not available'}
    </motion.h2>
    {status === 'unavailable' && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-xl text-white text-center"
      >
        Sorry, our service is currently not available in your area.
      </motion.p>
    )}
  </div>
);

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [shouldFetchProducts, setShouldFetchProducts] = useState(false);
  const [isLocationAllowed, setIsLocationAllowed] = useState(null);
  const [checkLocation] = useCheckLocationMutation();

  const { data: categories, isLoading: isCategoriesLoading, isError } = useFetchCategoriesQuery();
  const { data: allProducts, isLoading: isLoadingProducts } = useAllProductsQuery(undefined, {
    skip: !shouldFetchProducts
  });

  useEffect(() => {
    checkUserLocation();
  }, []);

  useEffect(() => {
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

  const checkUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const result = await checkLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }).unwrap();
            setIsLocationAllowed(result.isAllowed);
          } catch (error) {
            console.error('Error checking location:', error);
            setIsLocationAllowed(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocationAllowed(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLocationAllowed(false);
    }
  };

  if (isLocationAllowed === null) {
    return <LocationCheck status="checking" />;
  }

  if (!isLocationAllowed) {
    return <LocationCheck status="unavailable" />;
  }

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

  const SkeletonCategory = () => (
    <div className="bg-gray-100 rounded-lg border shadow-lg p-6 animate-pulse">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );

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

  const renderCategories = () => {
    if (isError) {
      return (
        <div className="text-2xl text-red-600 text-center">
          Error loading categories
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence>
          {isCategoriesLoading
            ? [...Array(10)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <SkeletonCategory />
                </motion.div>
              ))
            : categories.map((category) => (
                <motion.div
                  key={category._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: "-100%" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 rounded-lg border shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl"
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <div className="text-center">
                    <div className="flex items-center">
                      <img src={imagePlaceholder} alt="category" className="w-12 h-12 object-cover justify-center items-center ml-8 mb-2" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">{category.name}</h3>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {isLoadingProducts || !allProducts
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
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="bg-gradient-to-b from-[#ecd388] to-white text-gray-800 py-6 relative">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.h1
            animate={{ fontSize: isSearchExpanded ? '1.25rem' : '1.5rem' }}
            transition={{ duration: 0.3 }}
            className="font-bold whitespace-nowrap"
          >
            Crave-Hub
          </motion.h1>
          <div className="relative flex items-center justify-end">
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '200px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="rounded-full border-2 border-yellow-500 focus:outline-none focus:border-yellow-600 text-sm bg-white px-3 py-1 mr-2"
                />
              )}
            </AnimatePresence>
            <motion.button
              onClick={toggleSearch}
              className="bg-yellow-500 text-white p-2 rounded-full focus:outline-none flex-shrink-0"
              whileTap={{ scale: 0.95 }}
            >
              {isSearchExpanded ? <FaTimes /> : <FaSearch />}
            </motion.button>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          style={{ width: '80%', margin: '0 auto' }}
        ></div>
      </header>
      <main className="container mx-auto px-4 py-8">
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
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
              Select your taste!
            </h2>
            {renderCategories()}
          </>
        )}
      </main>
    </motion.div>
  );
};

export default HomePage;