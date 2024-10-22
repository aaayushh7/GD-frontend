import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavoriteProduct, removeFromFavorites } from '../../redux/features/favorites/favoriteSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/features/cart/cartSlice';

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromFavorites = (product) => {
    dispatch(removeFromFavorites(product._id));
    toast.info('Removed from favorites', {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      className: 'bg-black text-white',
    });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Added to cart', {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'bg-yellow-500 text-black',
    });
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 mb-4">
                <FiArrowLeft className="mr-2" />
                <span className="text-sm font-medium">Back to Menu</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
              <p className="text-gray-600">
                {Favorites.length} {Favorites.length === 1 ? 'item' : 'items'} in your collection
              </p>
            </div>

            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16 bg-white rounded-lg shadow-sm"
              >
                <FiHeart className="mx-auto text-yellow-400 mb-6" size={48} />
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your favorites list is empty</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Explore our menu and save your favorite dishes!</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  <FiShoppingBag className="mr-2" />
                  Browse Menu
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-end mb-6">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FiChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sortedFavorites.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveFromFavorites(product)}
                          className="absolute top-2 right-2 p-1 bg-white bg-opacity-75 rounded-full shadow-sm hover:bg-red-50 transition-colors duration-200"
                        >
                          <FiTrash2 className="text-red-500" size={16} />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2 truncate">{product.brand}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-900">
                            {product.price.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'INR',
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-yellow-500 text-black text-sm py-1 rounded-md hover:bg-yellow-600 transition-colors duration-300 flex items-center justify-center"
                        >
                          <FiShoppingBag className="mr-1" size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;