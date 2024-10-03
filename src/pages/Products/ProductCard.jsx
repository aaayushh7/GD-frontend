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
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex ${expanded ? 'min-h-[7.5rem]' : 'h-[7.5rem]'} border border-gray-200 p-3`}>
      <div className="w-[60%] pr-2 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{p?.name}</h3>
          <div className="text-gray-600 text-xs mb-1">
            <p className="leading-relaxed">
              {expanded ? p?.description : truncateDescription(p?.description, 15)}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-yellow-600 hover:text-yellow-700 transition-colors duration-200 flex items-center mb-1"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <FiChevronUp className="ml-1" size={10} />
              </>
            ) : (
              <>
                <span>View details</span>
                <FiChevronDown className="ml-1" size={10} />
              </>
            )}
          </button>
        </div>
        <div>
          <span className="text-sm font-bold text-gray-900 block">
            {p?.price?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
            })}
          </span>
        </div>
      </div>
      <div className="w-[40%] relative flex items-center justify-center">
        <div className="w-20 h-20 relative">
          <img
            className="w-full h-full object-cover rounded border border-gray-100"
            src={p.image}
            alt={p.name}
          />
          <span className="absolute top-1 right-1 bg-yellow-100 text-yellow-800 text-[8px] font-semibold px-1 py-0.5 rounded-full">
            {p?.brand}
          </span>
          <div className="absolute top-1 left-1">
            <HeartIcon product={p} size={14} />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[80%]">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 text-black px-0.5 py-1 rounded text-[10px] font-semibold shadow-sm flex items-center justify-center"
              >
                <FiShoppingCart className="mr-1" size={10} />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center bg-white rounded-lg shadow-sm border border-yellow-400">
                <button
                  className="text-yellow-600 p-1 hover:bg-yellow-50 transition-colors duration-200"
                  onClick={decrementQty}
                >
                  <FiMinus size={10} />
                </button>
                <span className="px-1 py-0.5 text-gray-800 text-[10px] font-semibold min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  className="text-yellow-600 p-1 hover:bg-yellow-50 transition-colors duration-200"
                  onClick={incrementQty}
                >
                  <FiPlus size={10} />
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