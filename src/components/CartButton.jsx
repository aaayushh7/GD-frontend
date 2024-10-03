import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { IconButton, Badge, Box, Typography } from '@mui/material';
import CartIcon from "../assets/cart";

const CartButton = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const location = useLocation();

  // Check if the current route is / or /shop
  const shouldShowCart = ['/', '/shop'].includes(location.pathname);

  if (!shouldShowCart || itemCount === 0) {
    return null; // Don't render anything if not on / or /shop routes or if cart is empty
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '29px',
        padding: '4px 14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Badge
        badgeContent={itemCount}
        color="error"
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#FF5722', // Orange badge
            color: '#FFFFFF',
            fontSize: '0.7rem',
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            top: 2,
            right: 2,
          },
        }}
      >
        <IconButton
          component={Link}
          to="/cart"
          size="small"
          sx={{
            color: '#FFC107', // Yellow
            '&:hover': {
              backgroundColor: 'rgba(255, 193, 7, 0.1)', // Light yellow background on hover
            },
          }}
        >
          <CartIcon />
        </IconButton>
      </Badge>
      <Typography
        component={Link}
        to="/cart"
        sx={{
          marginLeft: '8px',
          color: '#008000', // Yellow text
          textDecoration: 'none', // Remove underline from link
          fontWeight: 'bold',
          '&:hover': {
            color: '#FFB300', // Slightly darker yellow on hover
          },
        }}
      >
        View Cart
      </Typography>
    </Box>
  );
};

export default CartButton;
