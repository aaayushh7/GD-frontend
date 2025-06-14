import React, { useState, useEffect } from 'react';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/features/cart/cartSlice';
import { addToFavorites, removeFromFavorites } from '../redux/features/favorites/favoriteSlice';
import { toast } from 'react-toastify';
import NativeFeatures from './NativeFeatures';

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favorites = useSelector((state) => state.favorites);
  const itemInCart = cartItems.find((item) => item._id === p._id);
  const isFavorite = favorites.some((item) => item._id === p._id);
  const [quantity, setQuantity] = useState(itemInCart ? itemInCart.qty : 0);
  const { triggerHaptic, shareContent } = NativeFeatures();

  useEffect(() => {
    setQuantity(itemInCart ? itemInCart.qty : 0);
  }, [itemInCart]);

  const handleAddToCart = async () => {
    await triggerHaptic();
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success('Item added to cart', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const toggleFavorite = async () => {
    await triggerHaptic();
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

  const incrementQty = async () => {
    await triggerHaptic();
    const newQty = quantity + 1;
    if (newQty <= p.countInStock) {
      dispatch(addToCart({ ...p, qty: newQty }));
    }
  };

  const decrementQty = async () => {
    await triggerHaptic();
    if (quantity > 1) {
      dispatch(addToCart({ ...p, qty: quantity - 1 }));
    } else if (quantity === 1) {
      dispatch(removeFromCart(p._id));
    }
  };

  const handleShare = async () => {
    await shareContent(
      p.name,
      `Check out this amazing ${p.name} for just ₹${p.price}!`,
      `${window.location.origin}/product/${p._id}`
    );
  };

  return (
    <div className={`
      flex rounded-lg shadow-sm overflow-hidden p-2 border-[1px] transition-all duration-200
      ${itemInCart 
        ? 'bg-gradient-to-r from-white to-[#cae6da] border-[#5c8072]' 
        : 'bg-gradient-to-r from-white to-[#cae6da] '
      }`}
    >
      {/* Left Section - Image and Heart */}
      <div className="relative w-[5.5rem] h-[6rem]">
        <div className={`
          w-full h-full rounded-lg shadow-sm overflow-hidden text-black
          ${itemInCart ? 'opacity-80' : 'bg-gray-50'}
        `}>
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
                : `${itemInCart ? 'text-gray-400' : 'text-gray-400'}`
            }`}
          />
        </button>
      </div>

      {/* Right Section - Details */}
      <div className="flex-1 ml-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold text-md mb-1 ${itemInCart ? 'text-black' : 'text-gray-900'}`}>
              {p?.name}
            </h3>
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
          <p className={`text-xs mb-2 ${itemInCart ? 'text-gray-700' : 'text-gray-600'}`}>
            {p?.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${itemInCart ? 'text-gray-800' : 'text-gray-900'}`}>
            {p?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-[#055d33] text-white px-6 py-2 rounded-lg text-xs font-semibold hover:bg-[#2a4f28] transition-colors duration-200 active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-center rounded-lg">
              <button
                className={`
                  p-1 transition-colors duration-200 rounded-md active:scale-95
                  ${itemInCart 
                    ? 'text-black border-white hover:bg-[#2a4f28] hover:text-white' 
                    : 'text-black hover:text-white hover:bg-[#055d33] border-[1px] border-[#055d33]'
                  }
                `}
                onClick={decrementQty}
              >
                <FiMinus size={16}  />
              </button>
              <span className={`
                px-3 py-1 font-semibold text-xs min-w-[24px] text-center rounded
                ${itemInCart 
                  ? ' text-black' 
                  : 'bg-[#cae6da] text-gray-800'
                }
              `}>
                {quantity}
              </span>
              <button
                className={`
                  p-1 transition-colors duration-200 rounded-md active:scale-95
                  ${itemInCart 
                    ? 'text-black border-white hover:bg-[#2a4f28] hover:text-white' 
                    : 'text-black hover:text-white hover:bg-[#055d33] border-[1px] border-[#055d33]'
                  }
                `}
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