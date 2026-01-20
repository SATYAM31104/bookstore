import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, handleAuthError } = useAuth();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistItems(parsedWishlist);
        console.log('Loaded wishlist from localStorage:', parsedWishlist);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    console.log('Saved wishlist to localStorage:', wishlistItems);
  }, [wishlistItems]);

  // Sync with backend when user logs in
  useEffect(() => {
    if (user) {
      syncWishlistWithBackend();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncWishlistWithBackend = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Syncing wishlist with backend for user:', user.email);
      const data = await wishlistAPI.getWishlist(user.token);
      if (data.wishlist && data.wishlist.items) {
        setWishlistItems(data.wishlist.items);
        console.log('Synced wishlist from backend:', data.wishlist.items);
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (book) => {
    try {
      setLoading(true);
      console.log('Adding to wishlist:', { book: book.title, user: user?.email });

      if (user) {
        // Add to backend wishlist
        console.log('Adding to backend wishlist...');
        const data = await wishlistAPI.addToWishlist(user.token, book.googleBookId);
        setWishlistItems(data.wishlist.items);
        console.log('Successfully added to backend wishlist:', data.wishlist.items);
        return;
      }

      // Fallback to local wishlist
      console.log('Adding to local wishlist...');
      const existingItem = wishlistItems.find(item => item.bookId === book.googleBookId);
      
      if (existingItem) {
        throw new Error('Book already in wishlist');
      }

      const newItem = {
        bookId: book.googleBookId,
        title: book.title,
        author: book.author,
        price: book.price,
        thumbnail: book.thumbnail,
        addedAt: new Date().toISOString()
      };
      setWishlistItems(prev => [...prev, newItem]);
      console.log('Added new item to local wishlist:', newItem);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Handle authentication errors
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
        if (error.message.includes('Access token has expired')) {
          handleAuthError();
        }
        throw new Error('Please login again to add items to wishlist.');
      } else if (error.message.includes('Book already in wishlist')) {
        throw new Error('This book is already in your wishlist.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid book. Please try again.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to add to wishlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      setLoading(true);
      console.log('Removing from wishlist:', bookId);

      if (user) {
        const data = await wishlistAPI.removeFromWishlist(user.token, bookId);
        setWishlistItems(data.wishlist.items);
        console.log('Removed from backend wishlist');
        return;
      }

      // Fallback to local wishlist
      setWishlistItems(prev => prev.filter(item => item.bookId !== bookId));
      console.log('Removed from local wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      console.log('Clearing wishlist');

      if (user) {
        await wishlistAPI.clearWishlist(user.token);
        setWishlistItems([]);
        console.log('Cleared backend wishlist');
        return;
      }

      // Fallback to local wishlist
      setWishlistItems([]);
      console.log('Cleared local wishlist');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (bookId, cartContext) => {
    try {
      setLoading(true);
      console.log('Moving to cart:', bookId);

      if (user) {
        // Move from wishlist to cart on backend
        const data = await wishlistAPI.moveToCart(user.token, bookId);
        setWishlistItems(data.wishlist.items);
        
        // Sync cart with backend
        if (cartContext && cartContext.syncCartWithBackend) {
          await cartContext.syncCartWithBackend();
        }
        
        console.log('Moved from backend wishlist to cart');
        return;
      }

      // Fallback to local operations
      const item = wishlistItems.find(item => item.bookId === bookId);
      if (item && cartContext && cartContext.addToCart) {
        await cartContext.addToCart(item, 1);
        setWishlistItems(prev => prev.filter(item => item.bookId !== bookId));
        console.log('Moved from local wishlist to cart');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (bookId) => {
    return wishlistItems.some(item => item.bookId === bookId);
  };

  const getWishlistItemCount = () => {
    const count = wishlistItems.length;
    console.log('Wishlist item count:', count);
    return count;
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isInWishlist,
    getWishlistItemCount,
    syncWishlistWithBackend
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;