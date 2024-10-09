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
  Paper,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontSize: '1.3rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#FF5722',
      dark: '#E64A19',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 87, 34, 0.1)',
          },
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
        py: 3,
      }}>
        <Container maxWidth="sm">
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 3, 
              color: 'text.primary', 
              '&:hover': { 
                bgcolor: 'rgba(255, 87, 34, 0.1)',
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
              p: 4, 
              bgcolor: 'background.paper',
            }}>
              <CardContent>
                <ShoppingCart sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
                <Typography variant="h5" gutterBottom color="text.primary">
                  Your cart is empty
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Add some delicious items to your cart!
                </Typography>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'primary.dark',
                    },
                    py: 1.5,
                    px: 4,
                  }}
                >
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              <Card sx={{ 
                bgcolor: 'background.paper',
              }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="text.primary" sx={{ mb: 3 }}>
                    Your Order
                  </Typography>
                  <Stack spacing={2}>
                    {cartItems.map((item) => (
                      <Paper
                        key={item._id}
                        elevation={0}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ 
                            width: 70, 
                            height: 70, 
                            objectFit: 'cover', 
                            borderRadius: 2,
                          }}
                        />
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ color: 'text.primary' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.brand}
                          </Typography>
                          <Typography variant="body1" color="primary.main" sx={{ mt: 0.5, fontWeight: 600 }}>
                            ₹ {item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <IconButton
                            onClick={() => item.qty > 1 ? addToCartHandler(item, item.qty - 1) : removeFromCartHandler(item._id)}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              bgcolor: 'background.paper',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              '&:hover': { 
                                bgcolor: 'primary.main',
                                color: 'white',
                              } 
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 2, fontWeight: 600 }}>
                            {item.qty}
                          </Typography>
                          <IconButton
                            onClick={() => addToCartHandler(item, item.qty + 1)}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              bgcolor: 'background.paper',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              '&:hover': { 
                                bgcolor: 'primary.main',
                                color: 'white',
                              } 
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
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
                    <Typography variant="body1" color="text.primary" fontWeight={600}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="text.primary">Total:</Typography>
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                      ₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                      },
                      '&:disabled': { bgcolor: '#E0E0E0' },
                      py: 1.5,
                      fontSize: '1rem',
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