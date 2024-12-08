import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Button,
  Container,
  Stack,
  Box,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ProductCard from '../pages/Products/ProductCard';
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import bucketLogo from '../assets/logobucket.png';
import { AddressSection, PaymentMethodSection } from './User/AddressSection';
import SimplifiedOrder from './Orders/PlaceOrder';
import CartRecommendation from '../components/CartRecommendation';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingItems, setLoadingItems] = React.useState({});
  const { data: categories } = useFetchCategoriesQuery();

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = async (product, qty) => {
    setLoadingItems(prev => ({ ...prev, [product._id]: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addToCart({ ...product, qty }));
    setLoadingItems(prev => ({ ...prev, [product._id]: false }));
  };

  const removeFromCartHandler = async (id) => {
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(removeFromCart(id));
    setLoadingItems(prev => ({ ...prev, [id]: false }));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const getCategoryName = React.useMemo(() => {
    if (!categories) return () => 'Global';
    const categoryMap = categories.reduce((acc, category) => {
      acc[category._id] = category.name;
      return acc;
    }, {});
    return (categoryId) => categoryMap[categoryId] || 'Global';
  }, [categories]);

  return (
    <div className="w-full bg-white overflow-hidden"> {/* Replace Container with full-width div */}
      <header className="flex z-50 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between w-full mb-1 mt-2">
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowBack />}
            sx={{
              my: 0,
              color: '#1A1A1A',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          />

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src={bucketLogo}
              alt="Bucket Logo"
              className="h-8 w-auto bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent"
            />
          </div>

          {/* Empty div to maintain flex spacing */}
          <div className="w-10" />
        </div>
      </header>

      <h2 className="text-sm text-gray-600 mt-4 flex items-center px-3">
        <span>Your Cart </span>
        <span className="flex-1 h-[1px] bg-gradient-to-r from-green-500 to-white ml-3"></span>
      </h2>


      {cartItems.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          <Stack spacing={3} sx={{ mb: 0, mt: 2, pb:0 }}>
            {cartItems.map((item) => (
              <Box key={item._id} className="relative px-3"> {/* Add relative positioning here */}
                <div className="absolute top-2 right-4 z-10"> {/* Position category absolutely */}
                  <span className="text-xs px-2 py-1 rounded-md bg-orange-100 text-orange-600 font-medium">
                    {getCategoryName(item.category)}
                  </span>
                </div>
                <ProductCard
                  p={item}
                  isLoading={loadingItems[item._id]}
                  onIncrement={() => addToCartHandler(item, 1)}
                  onDecrement={() => removeFromCartHandler(item._id)}
                />
              </Box>
            ))}
            <h2 className="text-sm text-gray-600 mt-4 flex items-center px-3">
              <span>You Might Also Like </span>
              <span className="flex-1 h-[1px] bg-gradient-to-r from-green-500 to-white ml-3"></span>
            </h2>
            <CartRecommendation/>
            <AddressSection />
            <SimplifiedOrder />

          </Stack>
        </>
      )}
    </div>
  );
};

export default Cart;