import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiMinus, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';
import HeartIcon from './HeartIcon';

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemInCart = cartItems.find((item) => item._id === p._id);
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

  const truncateDescription = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 flex ${expanded ? 'min-h-[8rem]' : 'h-[8rem]'} border border-gray-100 p-4`}>
      <div className="w-[65%] pr-3 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{p?.name}</h3>
          <div className="text-gray-600 text-sm mb-2">
            <p className="leading-relaxed">
              {expanded ? p?.description : truncateDescription(p?.description, 20)}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-yellow-600 hover:text-yellow-700 transition-colors duration-200 flex items-center mb-2"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <FiChevronUp className="ml-1" size={12} />
              </>
            ) : (
              <>
                <span>View details</span>
                <FiChevronDown className="ml-1" size={12} />
              </>
            )}
          </button>
        </div>
        <div>
          <span className="text-base font-bold text-gray-900 block">
            {p?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
        </div>
      </div>
      <div className="w-[35%] relative flex items-center justify-center">
        <div className="w-24 h-24 relative">
          <img
            className="w-full h-full object-cover rounded-xl shadow-sm transition-transform duration-300 ease-in-out hover:scale-105"
            src={p.image}
            alt={p.name}
          />
          <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
            {p?.brand}
          </span>
          <div className="absolute top-2 left-2">
            <HeartIcon product={p} size={16} />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[90%]">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 text-black px-2 py-1.5 rounded-xl text-xs font-semibold shadow-md hover:bg-yellow-500 transition-colors duration-200 ease-in-out flex items-center justify-center"
              >
                <FiShoppingCart className="mr-1" size={12} />
                Add 
              </button>
            ) : (
              <div className="flex items-center justify-center bg-white rounded-full shadow-md border border-yellow-400">
                <button
                  className="text-yellow-600 p-1.5 hover:bg-yellow-50 transition-colors duration-200 rounded-l-full"
                  onClick={decrementQty}
                >
                  <FiMinus size={12} />
                </button>
                <span className="px-2 py-1 text-gray-800 text-xs font-semibold min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  className="text-yellow-600 p-1.5 hover:bg-yellow-50 transition-colors duration-200 rounded-r-full"
                  onClick={incrementQty}
                >
                  <FiPlus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;