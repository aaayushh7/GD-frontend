import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Box,
  Container,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#FFC107',
      dark: '#FFA000',
    },
    secondary: {
      main: '#212121',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E0E0E0',
        },
      },
    },
  },
});

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: 2,
      }}>
        <Container maxWidth="xs">
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2, 
              color: 'secondary.main', 
              '&:hover': { 
                bgcolor: 'rgba(255, 193, 7, 0.1)',
              },
            }}
          >
            <Typography variant="button">
              Back to Menu
            </Typography>
          </Button>

          {cartItems.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              p: 3, 
              bgcolor: 'background.paper',
            }}>
              <CardContent>
                <ShoppingCart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="text.primary">
                  Your cart is empty
                </Typography>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'primary.main', 
                    color: 'secondary.main',
                    '&:hover': { 
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              <Card sx={{ 
                bgcolor: 'background.paper',
              }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="text.primary" sx={{ mb: 2 }}>
                    Your Order
                  </Typography>
                  <Stack spacing={2}>
                    {cartItems.map((item) => (
                      <Box key={item._id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid #E0E0E0',
                      }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            objectFit: 'cover', 
                            borderRadius: 1,
                          }}
                        />
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ color: 'text.primary' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.brand}
                          </Typography>
                          <Typography variant="body1" color="primary.main" sx={{ mt: 0.5 }}>
                            ₹ {item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <IconButton
                            onClick={() => item.qty > 1 ? addToCartHandler(item, item.qty - 1) : removeFromCartHandler(item._id)}
                            size="small"
                            sx={{ color: 'secondary.main', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1 }}>
                            {item.qty}
                          </Typography>
                          <IconButton
                            onClick={() => addToCartHandler(item, item.qty + 1)}
                            size="small"
                            sx={{ color: 'secondary.main', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ 
                bgcolor: 'background.paper',
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="text.primary">
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">Items:</Typography>
                    <Typography variant="body1" color="text.primary">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderColor: 'primary.main' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="text.primary">Total:</Typography>
                    <Typography variant="h6" color="primary.main">
                      ₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'secondary.main',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                      },
                      '&:disabled': { bgcolor: '#E0E0E0' },
                      py: 1.5
                    }}
                  >
                    Proceed To Checkout
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Cart;