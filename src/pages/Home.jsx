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
import bucketLogo from '../assets/logobucket.png';
import RandomProducts from '../components/RandomProducts';
import bannerImage from '../assets/Banner.png'
import Ur from '../assets/UrLogo2.svg';
import ShopCategories from './ShopCategories';
import HeaderAddressModal from './User/HeaderAddress';


// Skeleton Components
const SkeletonLoader = {
  Category: () => (
    <div className="flex flex-col items-center w-24">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
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
  const [showAllRegional, setShowAllRegional] = useState(true);
  const [showAllShop, setShowAllShop] = useState(true);
  const [locationStatus, setLocationStatus] = useState(() => {
    const storedStatus = localStorage.getItem('locationStatus');
    return storedStatus || 'checking';
  });
  const [checkLocation] = useCheckLocationMutation();
  const [activeTab, setActiveTab] = useState('Meal');


  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery();
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

  const renderRegionalFoods = () => {
    if (!categories && !isCategoriesLoading) return null;

    const regionalCategories = showAllRegional
      ? categories?.slice(0, 15)
      : categories?.slice(0, 16);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md text-gray-600">Regional Foods</h2>
          
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
              ? Array(8).fill(null).map((_, index) => (
                <SkeletonLoader.Category key={`skeleton-regional-${index}`} />
              ))
              : regionalCategories?.map((category) => (
                <motion.div
                  key={category._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`flex flex-col items-center ${!showAllRegional ? 'w-24' : ''}`}
                >
                  <div className="w-[4.5rem] h-[4.5rem] rounded-lg bg-white  flex items-center justify-center hover:shadow-md transition-all overflow-hidden">
                    <img
                      src={category.image || './src/assets/12.png'}
                      alt={category.name}
                      className="w-[4.5rem] h-[4.5rem] object-cover"
                      onError={(e) => {
                        e.target.src = './src/assets/12.png'; // Fallback image if category image fails to load
                      }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>


        </div>
        <div>
          <h2 className="text-sm text-gray-600 mt-4 flex items-center">
            <span>You might also like </span>
            <span className="flex-1 h-[1px] bg-green-500 ml-2"></span>
          </h2>
          <RandomProducts count={3} /> {/* Or use default of 3 */}
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


      <header className="px-4 py-3 mb-[3rem] border-b border-gray-200 shadow-sm bg-[#FDF7E4]">
        <div className="flex items-center justify-center mb-3 mt-2">
        <HeaderAddressModal />
        <h1 className="text-2xl font-bold">
            <img
              src={bucketLogo}
              alt="Bucket Logo"
              className="h-8 w-auto bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent"
            />
          </h1>
        </div>
      </header>

      <div className="w-full flex items-center justify-center">
        <div className="flex w-[80%] rounded-md text-sm bg-cream-100 border-[1px] border-[#afd1b2]">
          <button
            onClick={() => setActiveTab('Meal')}
            className={`flex-1 py-1 text-center font-medium transition-all duration-200 ${activeTab === 'Meal'
              ? 'bg-[#1D3A1C] text-white rounded-md shadow-sm'
              : 'bg-[#FFF3E6] text-[#A5521C]'
              }`}
          >
            <span>
              <img src={Ur} alt="Ur Logo" className="inline-block" /></span>
            Meal
          </button>
          <button
            onClick={() => setActiveTab('Mart')}
            className={`flex-1 py-1 text-center font-medium transition-all duration-200 ${activeTab === 'Mart'
              ? 'bg-[#1D3A1C] text-white rounded-md shadow-sm'
              : 'bg-[#FFF3E6] text-[#A5521C]'
              }`}
          >
            <span>
            <img src={Ur} alt="Ur Logo" className="inline-block" /></span>
            Mart
          </button>
        </div>
      </div>
      <div className="px-4 mb-6 mt-4">
        <div className="relative w-ful ">
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
                className="w-full pl-10 pr-4 py-1 rounded-xl border-[1px] border-[#afd1b2] focus:border-gray-400 transition-colors"
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
                className="w-full pl-10 pr-4 py-1 rounded-xl border-[1px] border-[#afd1b2] focus:border-gray-400 transition-colors cursor-pointer"
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
            width: '95%',
            height: '9rem'
          }}
        >
      
        </div>
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