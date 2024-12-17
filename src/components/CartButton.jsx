import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const CartButton = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current route is / or /shop
  const shouldShowCart = ['/', '/shop'].includes(location.pathname);

  if (!shouldShowCart || itemCount === 0) {
    return null; // Don't render anything if not on / or /shop routes or if cart is empty
  }

  const handleViewCart = () => {
    navigate('/cart');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        width: '90%',
        maxWidth: '350px',
        borderRadius: '40px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#ff7415', // Orange background
          flex: 5,
          display: 'flex',
          alignItems: 'center',
          padding: '10px 15px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#FF8C00', // Slightly darker orange on hover
          }
        }}
      >
        <Typography 
          sx={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 400,
          }}
        >
          {itemCount} Item{itemCount !== 1 ? 's' : ''} added to ur cart
        </Typography>
      </Box>
      
      <Box
        onClick={handleViewCart}
        sx={{
          backgroundColor: '#ff7415', // Green background
          flex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 15px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          
        }}
      >
        <button className='px-3 text-sm py-1 bg-[#0d6d3f] rounded-full'>
          View Bucket
        </button>
        
      </Box>
    </Box>
  );
};

export default CartButton;