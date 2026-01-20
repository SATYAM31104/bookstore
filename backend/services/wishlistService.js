const Wishlist = require('../models/Wishlist');
const { getBookById } = require('./bookService');

const getWishlist = async (userId) => {
    try {
        let wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            // Create empty wishlist if doesn't exist
            wishlist = await Wishlist.create({
                userId,
                items: []
            });
        }
        
        return wishlist;
    } catch (error) {
        console.error('Error getting wishlist:', error);
        throw new Error('Failed to get wishlist');
    }
};

const addToWishlist = async (userId, bookId) => {
    try {
        // Get book details from Google Books API
        const bookData = await getBookById(bookId);
        if (!bookData) {
            throw new Error('Book not found');
        }
        
        let wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            // Create new wishlist
            wishlist = await Wishlist.create({
                userId,
                items: [{
                    bookId: bookData.googleBookId,
                    title: bookData.title,
                    author: bookData.author,
                    price: bookData.price,
                    thumbnail: bookData.thumbnail
                }]
            });
        } else {
            // Check if book already exists in wishlist
            const existingItem = wishlist.items.find(item => item.bookId === bookId);
            
            if (existingItem) {
                throw new Error('Book already in wishlist');
            }
            
            // Add new item to wishlist
            wishlist.items.push({
                bookId: bookData.googleBookId,
                title: bookData.title,
                author: bookData.author,
                price: bookData.price,
                thumbnail: bookData.thumbnail
            });
            
            await wishlist.save();
        }
        
        return wishlist;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

const removeFromWishlist = async (userId, bookId) => {
    try {
        const wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }
        
        // Remove item from wishlist
        wishlist.items = wishlist.items.filter(item => item.bookId !== bookId);
        await wishlist.save();
        
        return wishlist;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

const clearWishlist = async (userId) => {
    try {
        const wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }
        
        wishlist.items = [];
        await wishlist.save();
        
        return wishlist;
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        throw error;
    }
};

const moveToCart = async (userId, bookId, cartService) => {
    try {
        const wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }
        
        const item = wishlist.items.find(item => item.bookId === bookId);
        if (!item) {
            throw new Error('Item not found in wishlist');
        }
        
        // Add to cart
        await cartService.addToCart(userId, bookId, 1);
        
        // Remove from wishlist
        wishlist.items = wishlist.items.filter(item => item.bookId !== bookId);
        await wishlist.save();
        
        return wishlist;
    } catch (error) {
        console.error('Error moving to cart:', error);
        throw error;
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart
};