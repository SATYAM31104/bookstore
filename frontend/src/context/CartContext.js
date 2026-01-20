import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, handleAuthError } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Saved cart to localStorage:', cartItems);
  }, [cartItems]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (user) {
      syncCartWithBackend();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncCartWithBackend = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Syncing cart with backend for user:', user.email);
      const data = await cartAPI.getCart(user.token);
      if (data.cart && data.cart.items) {
        setCartItems(data.cart.items);
        console.log('Synced cart from backend:', data.cart.items);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book, quantity = 1) => {
    try {
      setLoading(true);
      console.log('Adding to cart:', { book: book.title, quantity, user: user?.email });

      if (user) {
        // Validate token before making request
        if (user && user.token) {
          try {
            const tokenParts = user.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              const bufferTime = 10 * 60; // 10 minutes buffer (increased from 5)
              
              if (payload.exp && (payload.exp - bufferTime) < currentTime) {
                console.log('Token expiring soon, but proceeding with request...');
                // Don't throw error immediately, let the backend handle it
              }
            }
          } catch (tokenError) {
            console.error('Token validation error (proceeding anyway):', tokenError);
            // Don't throw error, let the backend validate
          }
        }

        // Add to backend cart
        console.log('Adding to backend cart...');
        const data = await cartAPI.addToCart(user.token, book.googleBookId, quantity);
        setCartItems(data.cart.items);
        console.log('Successfully added to backend cart:', data.cart.items);
        return;
      }

      // Fallback to local cart
      console.log('Adding to local cart...');
      const existingItem = cartItems.find(item => item.bookId === book.googleBookId);
      
      if (existingItem) {
        setCartItems(prev => 
          prev.map(item => 
            item.bookId === book.googleBookId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
        console.log('Updated existing item in local cart');
      } else {
        const newItem = {
          bookId: book.googleBookId,
          title: book.title,
          author: book.author,
          price: book.price,
          thumbnail: book.thumbnail,
          quantity: quantity
        };
        setCartItems(prev => [...prev, newItem]);
        console.log('Added new item to local cart:', newItem);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Provide more specific error messages
      if (error.message.includes('session has expired') || error.message.includes('expired')) {
        throw new Error('Your session has expired. Please login again to add items to cart.');
      } else if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
        // Only clear auth data if it's definitely an auth error from the server
        if (error.message.includes('Access token has expired')) {
          handleAuthError(); // Clear user data only for confirmed expiration
        }
        throw new Error('Please login again to add items to cart.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid book or quantity. Please try again.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to add to cart. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      setLoading(true);
      console.log('Removing from cart:', bookId);

      if (user) {
        const data = await cartAPI.removeFromCart(user.token, bookId);
        setCartItems(data.cart.items);
        console.log('Removed from backend cart');
        return;
      }

      // Fallback to local cart
      setCartItems(prev => prev.filter(item => item.bookId !== bookId));
      console.log('Removed from local cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(bookId);
    }

    try {
      setLoading(true);
      console.log('Updating quantity:', { bookId, quantity });

      if (user) {
        // Use the dedicated updateQuantity endpoint
        const data = await cartAPI.updateQuantity(user.token, bookId, quantity);
        setCartItems(data.cart.items);
        console.log('Updated quantity in backend cart');
        return;
      }

      // Fallback to local cart
      setCartItems(prev => 
        prev.map(item => 
          item.bookId === bookId 
            ? { ...item, quantity: quantity }
            : item
        )
      );
      console.log('Updated quantity in local cart');
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      console.log('Clearing cart');

      if (user) {
        await cartAPI.clearCart(user.token);
        setCartItems([]);
        console.log('Cleared backend cart');
        return;
      }

      // Fallback to local cart
      setCartItems([]);
      console.log('Cleared local cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Cart total calculated:', total);
    return total;
  };

  const getCartItemCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('Cart item count:', count);
    return count;
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    syncCartWithBackend
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;