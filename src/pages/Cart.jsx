import React, { useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box,
  Container,
  Stack,
  IconButton,
  Paper,
  Fade,
  LinearProgress,
  Chip,
  Skeleton,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Add, Remove, LocalDining } from '@mui/icons-material';
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontSize: '1.4rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontSize: '1.1rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.95rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.85rem',
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
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
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 193, 7, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
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
  const { data: categories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

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

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce((acc, category) => {
      acc[category._id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const getCategoryName = (categoryId) => {
    return categoryMap[categoryId] || 'Global';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Main Course': '#FF9800',
      'Appetizer': '#FFB74D',
      'Dessert': '#FFA726',
      'Beverage': '#FFB300',
      'Global': '#FFC107',
    };
    return colors[category] || colors['Global'];
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: '#FAFAFA',
        minHeight: '100vh',
        pb: { xs: 10, sm: 6 },
        pt: 2,
      }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 3,
              color: '#1A1A1A',
              '&:hover': { bgcolor: 'rgba(255, 193, 7, 0.08)' },
              fontWeight: 600,
              fontSize: '0.95rem',
              pl: 1,
            }}
          >
            Back to Menu
          </Button>

          {loading && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress 
                sx={{ 
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 193, 7, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#FFC107',
                    borderRadius: 2,
                  }
                }} 
              />
            </Box>
          )}

          {cartItems.length === 0 ? (
            <Fade in={!loading}>
              <Card sx={{ 
                textAlign: 'center',
                p: { xs: 3, sm: 4 },
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <CardContent>
                  <ShoppingCart sx={{ 
                    fontSize: { xs: 70, sm: 80 },
                    color: '#FFC107',
                    mb: 3,
                    opacity: 0.9,
                  }} />
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: '#1A1A1A',
                    mb: 1,
                    fontWeight: 600,
                  }}>
                    Your cart is feeling a bit lonely
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#666666',
                    mb: 3,
                    fontSize: '0.95rem',
                  }}>
                    Let's add some delicious meals to brighten its day!
                  </Typography>
                  <Button
                    component={Link}
                    to="/shop"
                    variant="contained"
                    startIcon={<LocalDining />}
                    sx={{ 
                      bgcolor: '#FFC107',
                      color: '#1A1A1A',
                      '&:hover': { bgcolor: '#FFB300' },
                      py: 1.25,
                      px: 4,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      textTransform: 'none',
                    }}
                  >
                    Explore Our Menu
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          ) : (
            <Fade in={!loading && !isCategoriesLoading}>
              <Stack spacing={2.5}>
                <Card sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 2.5,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: '#1A1A1A',
                      mb: 3,
                      fontWeight: 600,
                    }}>
                      Your Culinary Journey
                    </Typography>
                    <Stack spacing={2.5}>
                      {cartItems.map((item) => {
                        const categoryName = getCategoryName(item.category);
                        return (
                          <Box key={item._id} sx={{ position: 'relative', mt: 2 }}>
                            <Chip
                              label={categoryName}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: -12,
                                left: 16,
                                height: '24px',
                                px: 1.5,
                                color: '#1A1A1A',
                                bgcolor: getCategoryColor(categoryName),
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 1,
                              }}
                            />
                            <Paper
                              elevation={0}
                              sx={{ 
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#FFFFFF',
                                border: '1px solid rgba(255, 193, 7, 0.3)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 16px rgba(255, 193, 7, 0.15)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.name}
                                  sx={{ 
                                    width: 65,
                                    height: 65,
                                    objectFit: 'cover',
                                    borderRadius: 1.5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                  }}
                                />
                                <Box sx={{ ml: 2, flexGrow: 1 }}>
                                  <Typography variant="subtitle1" sx={{ 
                                    color: '#1A1A1A',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    mb: 0.5,
                                  }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: '#666666',
                                    fontSize: '0.85rem',
                                    mb: 0.5,
                                  }}>
                                    {item.brand}
                                  </Typography>
                                  <Typography variant="subtitle2" sx={{ 
                                    fontWeight: 700,
                                    color: '#1A1A1A',
                                  }}>
                                    ₹ {item.price.toFixed(2)}
                                  </Typography>
                                </Box>
                                <Box sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  ml: 1.5,
                                }}>
                                  <IconButton
                                    onClick={() => item.qty > 1 ? addToCartHandler(item, item.qty - 1) : removeFromCartHandler(item._id)}
                                    size="small"
                                    sx={{ 
                                      color: '#1A1A1A',
                                      bgcolor: 'rgba(255, 193, 7, 0.1)',
                                      '&:hover': {
                                        bgcolor: 'rgba(255, 193, 7, 0.2)',
                                      },
                                      padding: '4px',
                                    }}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Typography variant="body2" sx={{ 
                                    mx: 1.5,
                                    fontWeight: 600,
                                    color: '#1A1A1A',
                                  }}>
                                    {item.qty}
                                  </Typography>
                                  <IconButton
                                    onClick={() => addToCartHandler(item, item.qty + 1)}
                                    size="small"
                                    sx={{ 
                                      color: '#1A1A1A',
                                      bgcolor: 'rgba(255, 193, 7, 0.1)',
                                      '&:hover': {
                                        bgcolor: 'rgba(255, 193, 7, 0.2)',
                                      },
                                      padding: '4px',
                                    }}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              {loadingItems[item._id] && (
                                <LinearProgress 
                                  sx={{ 
                                    mt: 2,
                                    borderRadius: 0.75,
                                    height: 2,
                                    bgcolor: 'rgba(255, 193, 7, 0.2)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#FFC107',
                                    }
                                  }} 
                                />
                              )}
                            </Paper>
                          </Box>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  position: { xs: 'fixed', sm: 'static' },
                  bottom: { xs: 0, sm: 'auto' },
                  left: { xs: 0, sm: 'auto' },
                  right: { xs: 0, sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: { xs: '16px 16px 0 0', sm: 2.5 },
                  zIndex: 1000,
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
                }}>
                  <CardContent sx={{ 
                    py: { xs: 2.5, sm: 3 },
                    px: { xs: 3, sm: 3 },
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}>
                      <Typography sx={{ 
                        color: '#1A1A1A',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}>
                        Total Amount:
                      </Typography>
                      <Typography sx={{ 
                        color: '#1A1A1A',
                        fontWeight: 700,
                        fontSize: '1.2rem',
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
                        bgcolor: '#FFC107',
                        color: '#1A1A1A',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: '0 2px 12px rgba(255, 193, 7, 0.3)',
                        '&:hover': {
                          bgcolor: '#FFB300',
                          boxShadow: '0 4px 16px rgba(255, 193, 7, 0.4)',
                        },
                        '&:disabled': { 
                          bgcolor: '#E0E0E0',
                          color: 'rgba(0, 0, 0, 0.38)',
                        },
                      }}
                    >
                      Proceed to Checkout
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