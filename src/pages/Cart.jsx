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
  Fade,
  LinearProgress,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontSize: '1.3rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.95rem',
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.85rem',
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
      letterSpacing: '0.01em',
    },
  },
  palette: {
    primary: {
      main: '#FFC107',
      dark: '#FFA000',
      light: '#FFD54F',
    },
    secondary: {
      main: '#212121',
      light: '#424242',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8, // Reduced border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 193, 7, 0.08)',
        },
      },
    },
  },
});

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [loadingItems, setLoadingItems] = React.useState({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    setLoadingItems(prev => ({ ...prev, [product._id]: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    dispatch(addToCart({ ...product, qty }));
    setLoadingItems(prev => ({ ...prev, [product._id]: false }));
  };

  const removeFromCartHandler = async (id) => {
    setLoadingItems(prev => ({ ...prev, [id]: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    dispatch(removeFromCart(id));
    setLoadingItems(prev => ({ ...prev, [id]: false }));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        pb: { xs: 10, sm: 4 }, // Added bottom padding for mobile
        pt: 2,
      }}>
        <Container maxWidth="sm">
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 3,
              color: 'secondary.main',
              '&:hover': { bgcolor: 'rgba(255, 193, 7, 0.08)' },
              fontWeight: 600,
            }}
          >
            Back to Menu
          </Button>

          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {cartItems.length === 0 ? (
            <Fade in={!loading}>
              <Card sx={{ 
                textAlign: 'center',
                p: { xs: 3, sm: 5 },
                bgcolor: 'background.paper',
              }}>
                <CardContent>
                  <ShoppingCart sx={{ 
                    fontSize: { xs: 60, sm: 80 },
                    color: 'primary.main',
                    mb: 3,
                    opacity: 0.9,
                  }} />
                  <Typography variant="h5" gutterBottom color="secondary.main">
                    Your cart is empty
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Time to add some delicious meals to your cart!
                  </Typography>
                  <Button
                    component={Link}
                    to="/shop"
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      bgcolor: 'primary.main',
                      color: 'secondary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                      py: 1.5,
                      px: 5,
                      fontSize: '1rem',
                    }}
                  >
                    Explore Menu
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          ) : (
            <Fade in={!loading}>
              <Stack spacing={2}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom color="secondary.main" sx={{ mb: 3 }}>
                      Your Order
                    </Typography>
                    <Stack spacing={2}>
                      {cartItems.map((item) => (
                        <Box key={item._id}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              p: { xs: 2, sm: 2.5 },
                              borderRadius: 2,
                              bgcolor: 'background.default',
                              border: '1px solid rgba(255, 193, 7, 0.12)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{ 
                                  width: { xs: 60, sm: 80 },
                                  height: { xs: 60, sm: 80 },
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                }}
                              />
                              <Box sx={{ ml: 2, flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ color: 'secondary.main' }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.brand}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1, fontWeight: 700 }}>
                                  ₹ {item.price.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                ml: { xs: 1, sm: 2 }
                              }}>
                                <IconButton
                                  onClick={() => item.qty > 1 ? addToCartHandler(item, item.qty - 1) : removeFromCartHandler(item._id)}
                                  size="small"
                                  sx={{ 
                                    color: 'secondary.main',
                                    bgcolor: 'background.paper',
                                  }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                <Typography variant="body1" sx={{ mx: { xs: 1, sm: 2 }, fontWeight: 600 }}>
                                  {item.qty}
                                </Typography>
                                <IconButton
                                  onClick={() => addToCartHandler(item, item.qty + 1)}
                                  size="small"
                                  sx={{ 
                                    color: 'secondary.main',
                                    bgcolor: 'background.paper',
                                  }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            {loadingItems[item._id] && (
                              <LinearProgress 
                                sx={{ 
                                  mt: 1,
                                  borderRadius: 1,
                                  height: 2,
                                }} 
                              />
                            )}
                          </Paper>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Checkout Section - Fixed at bottom on mobile */}
                <Card sx={{ 
                  position: { xs: 'fixed', sm: 'static' },
                  bottom: { xs: 0, sm: 'auto' },
                  left: { xs: 0, sm: 'auto' },
                  right: { xs: 0, sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: { xs: '12px 12px 0 0', sm: 2 },
                  zIndex: { xs: 1000, sm: 'auto' },
                  boxShadow: { 
                    xs: '0 -4px 12px rgba(0, 0, 0, 0.1)',
                    sm: '0 4px 16px rgba(0, 0, 0, 0.04)'
                  },
                }}>
                  <CardContent sx={{ py: { xs: 2, sm: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: { xs: 2, sm: 0 }
                    }}>
                      <Typography variant="h6" color="secondary.main">
                        Total Amount:
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: 'secondary.main',
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', sm: '1.3rem' }
                      }}>
                        ₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'secondary.main',
                        py: 1.5,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                        '&:disabled': { 
                          bgcolor: '#E0E0E0',
                          color: 'rgba(0, 0, 0, 0.26)',
                        },
                      }}
                    >
                      Proceed To Checkout
                    </Button>
                  </CardContent>
                </Card>
              </Stack>
            </Fade>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Cart;