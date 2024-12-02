import React, { useState, useEffect } from 'react';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/features/cart/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../redux/features/favorites/favoriteSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favorites = useSelector((state) => state.favorites);
  const itemInCart = cartItems.find((item) => item._id === p._id);
  const isFavorite = favorites.some((item) => item._id === p._id);
  const [quantity, setQuantity] = useState(itemInCart ? itemInCart.qty : 0);

  useEffect(() => {
    setQuantity(itemInCart ? itemInCart.qty : 0);
  }, [itemInCart]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success('Item added to cart', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(p._id));
      toast.info('Removed from favorites', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      dispatch(addToFavorites(p));
      toast.success('Added to favorites', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const incrementQty = () => {
    const newQty = quantity + 1;
    if (newQty <= p.countInStock) {
      dispatch(addToCart({ ...p, qty: newQty }));
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      dispatch(addToCart({ ...p, qty: quantity - 1 }));
    } else if (quantity === 1) {
      dispatch(removeFromCart(p._id));
    }
  };

  return (
    <div className="flex bg-[#f0f6f4] rounded-lg shadow-sm overflow-hidden p-2  transition-shadow duration-200">
      {/* Left Section - Image and Heart */}
      <div className="relative w-[5.5rem] h-[5.5rem">
        <div className="w-full h-full bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={toggleFavorite}
          className="absolute bottom-1 right-1 p-1.5 bg-transparent rounded-full transition-colors duration-200"
        >
          <FiHeart
            size={16}
            className={`${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Right Section - Details */}
      <div className="flex-1 ml-4 flex flex-col justify-between">
        <div>
          <h3 className=" font-semibold text-md text-gray-900 mb-1">{p?.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{p?.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            {p?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-[#055d33] text-white px-6 py-1 rounded-lg text-xs font-semibold hover:bg-[#2a4f28] transition-colors duration-200"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-center bg-gray-50 rounded-lg ">
              <button
                className="text-white p-1 hover:bg-gray-100 bg-[#055d33] transition-colors duration-200 rounded-md"
                onClick={decrementQty}
              >
                <FiMinus size={16} />
              </button>
              <span className="px-3 py-1 text-gray-800 font-semibold text-xs min-w-[24px] text-center bg-white">
                {quantity}
              </span>
              <button
                className="text-white p-1 hover:bg-gray-100 bg-[#055d33] transition-colors duration-200 rounded-md"
                onClick={incrementQty}
              >
                <FiPlus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;