import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setChecked } from '../redux/features/shop/shopSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { FaSearch, FaBars, FaUser, FaTimes } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import imagePlaceholder from '../assets/12.png';
import ProductCard from "./Products/ProductCard";
import { useCheckLocationMutation } from '../redux/api/apiSlice';
import bucketLogo from '../assets/logobucket.png'; // Import the image


const LocationCheck = ({ status, onRetry }) => (
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
      <>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-xl text-white text-center"
        >
          Sorry, our service is currently not available in your area or we couldn't access your location.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 bg-white text-yellow-500 px-6 py-2 rounded-full font-bold"
          onClick={onRetry}
        >
          Retry
        </motion.button>
      </>
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
  const [showAllRegional, setShowAllRegional] = useState(false);
  const [showAllShop, setShowAllShop] = useState(false);
  const [locationStatus, setLocationStatus] = useState(() => {
    const storedStatus = localStorage.getItem('locationStatus');
    return storedStatus || 'checking';
  });
  const [checkLocation] = useCheckLocationMutation();

  const { data: categories, isLoading: isCategoriesLoading, isError } = useFetchCategoriesQuery();
  const { data: allProducts, isLoading: isLoadingProducts } = useAllProductsQuery(undefined, {
    skip: !shouldFetchProducts
  });

  useEffect(() => {
    if (locationStatus === 'checking') {
      checkUserLocation();
    }
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

  

  const handleBannerClick = () => {
    if (categories && categories.length >= 4) {
      dispatch(setChecked([categories[3]._id]));
      navigate('/shop');
    }
  };

  const checkUserLocation = () => {
    setLocationStatus('checking');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const result = await checkLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }).unwrap();
            const newStatus = result.isAllowed ? 'allowed' : 'unavailable';
            setLocationStatus(newStatus);
            localStorage.setItem('locationStatus', newStatus);
          } catch (error) {
            console.error('Error checking location:', error);
            setLocationStatus('unavailable');
            localStorage.setItem('locationStatus', 'unavailable');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('unavailable');
          localStorage.setItem('locationStatus', 'unavailable');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationStatus('unavailable');
      localStorage.setItem('locationStatus', 'unavailable');
    }
  };

  if (locationStatus === 'checking' || locationStatus === 'unavailable') {
    return <LocationCheck status={locationStatus} onRetry={checkUserLocation} />;
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
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  );

  const SkeletonShopCategory = () => (
    <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
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

  const renderRegionalFoods = () => {
    if (!categories) return null;
    
    const regionalCategories = showAllRegional 
      ? categories.slice(0, 8)
      : categories.slice(0, 7);
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm text-gray-600">Regional Foods</h2>
          <button 
            onClick={() => setShowAllRegional(!showAllRegional)}
            className="text-green-600 text-sm font-medium"
          >
            {showAllRegional ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>
          {`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
          <div className={`grid grid-rows-2 grid-flow-col gap-4 ${showAllRegional ? 'grid-cols-3' : ''}`}
               style={{ minWidth: showAllRegional ? '100%' : 'auto' }}>
            {isCategoriesLoading
              ? [...Array(showAllRegional ? 8 : 6)].map((_, index) => (
                  <SkeletonCategory key={`skeleton-regional-${index}`} />
                ))
              : regionalCategories.map((category) => (
                  <motion.div
                    key={category._id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category._id)}
                    className={`flex flex-col items-center ${!showAllRegional ? 'w-24' : ''}`}
                  >
                    <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:shadow-md transition-all">
                      <img src={imagePlaceholder} alt={category.name} className="w-12 h-12 object-cover"/>
                    </div>
                    <p className="mt-2 text-xs text-center font-medium text-gray-500">{category.name}</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    );
  };

  const renderShopCategories = () => {
    if (!categories) return null;

    const shopCategories = showAllShop 
      ? categories.slice(6)
      : categories.slice(6, 9);
    
    const gradients = [
      'from-[#1f6944] to-[#cdd5c0]',
      'from-[#ff8027] to-[#cdd5c0]',
      'from-[#ff3e3e] to-[#cdd5c0]'
      // bg-gradient-to-r from-[#1f6944] to-[#cdd5c0]
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm text-gray-500">Shop ur things</h2>
          <button 
            onClick={() => setShowAllShop(!showAllShop)}
            className="text-green-600 text-sm font-medium"
          >
            {showAllShop ? 'Show Less' : 'See All'}
          </button>
        </div>
        <div className="space-y-4">
          {isCategoriesLoading
            ? [...Array(showAllShop ? categories.length - 6 : 3)].map((_, index) => (
                <SkeletonShopCategory key={`skeleton-shop-${index}`} />
              ))
            : shopCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`bg-gradient-to-r ${gradients[index % 3]} rounded-xl p-4 cursor-pointer text-white`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{category.name}</h3>
                    <img src={imagePlaceholder} alt={category.name} className="w-12 h-12 object-cover rounded"/>
                  </div>
                </motion.div>
              ))}
        </div>
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
    <div className="min-h-screen bg-[#FDF7E4]">
      {/* Header */}
      <header className="px-4 py-3 mb-5 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 mt-2">
          <FaBars className="text-xl cursor-pointer text-gray-500" />
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

      {/* Search Bar */}
      <div className="px-4 mb-6">
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
                className="w-full pl-10 pr-4 py-1 rounded-xl  border-[1px] border-[#afd1b2] bg-[#FFF6E3] focus:border-gray-400 transition-colors"
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
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="What do you want to eat?"
                onClick={toggleSearch}
                className="w-full pl-10 pr-4 py-1 rounded-xl  border-[1px] border-[#afd1b2] bg-[#FFF6E3] focus:border-gray-400 transition-colors cursor-pointer"
                readOnly
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Offer Banner */}
      {!isSearchExpanded && (
        <div className="px-4 mb-8">
          <div className="bg-gradient-to-r from-[#1f6944] to-[#cdd5c0] rounded-md p-4 text-white">
            <h3 className="text-md mb-1 font-bold">Get 10% off on <br/>ur favourites</h3>
            <p className="text-xs opacity-90 mb-3">On your first purchase. <br/><span className='font-bold'>USE CODE: URFIRST</span></p>
            <button 
              onClick={handleBannerClick}
              className="bg-[#fff5e3] text-green-700 px-4 py-1 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
      {/* Main Content */}
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
            {renderRegionalFoods()}
            {renderShopCategories()}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;