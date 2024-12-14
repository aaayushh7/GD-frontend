import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavoriteProduct, removeFromFavorites } from '../../redux/features/favorites/favoriteSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiFilter, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/features/cart/cartSlice';
import ProductCard from './ProductCard';

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <FiArrowLeft size={24} />
              </Link>
              <h1 className="text-xl text-gray-900">Favorites</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-gray-600 text-sm font-medium pl-8 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <FiFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLoading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-6"
          >
            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-[60vh] text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiHeart className="text-gray-400" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
                <p className="text-gray-500 mb-6 max-w-sm">Start exploring our menu and save your favorite items here!</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-100"
                >
                  <FiShoppingBag className="mr-2" size={18} />
                  Browse Menu
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {sortedFavorites.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard p={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;