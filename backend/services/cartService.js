const Cart = require('../models/Cart');
const bookService = require('./bookService');

const addToCart = async (userId, googleBookId, quantity = 1) => {
    try {
        // Since we're using Google Books API, we don't need to check if book exists in DB
        // The bookId will be the Google Books ID
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // Create new cart
            cart = await Cart.create({
                userId,
                items: [{
                    bookId: googleBookId,
                    quantity
                }]
            });
        } else {
            // Check if book already exists in cart
            const existingItem = cart.items.find(item => item.bookId.toString() === googleBookId);
            
            if (existingItem) {
                // Update quantity
                existingItem.quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ bookId: googleBookId, quantity });
            }
            
            await cart.save();
        }
        
        return cart;
    } catch (error) {
        console.error('Error in addToCart:', error);
        throw new Error('Failed to add item to cart');
    }
};

const getCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // Return empty cart if none exists
            return {
                userId,
                items: [],
                totalAmount: 0
            };
        }
        
        // Get book details from Google Books API for each item
        const cartWithBookDetails = {
            ...cart.toObject(),
            items: []
        };
        
        let totalAmount = 0;
        
        for (const item of cart.items) {
            try {
                // First try to get individual book details
                let book;
                try {
                    book = await bookService.getBookById(item.bookId);
                } catch (error) {
                    console.log(`Book ${item.bookId} not found individually, searching in all books...`);
                    
                    // Fallback: search in all books
                    const books = await bookService.getAllBooks();
                    book = books.find(b => b.googleBookId === item.bookId);
                }
                
                if (book) {
                    const cartItem = {
                        bookId: item.bookId,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        thumbnail: book.thumbnail,
                        quantity: item.quantity,
                        subtotal: book.price * item.quantity
                    };
                    
                    cartWithBookDetails.items.push(cartItem);
                    totalAmount += cartItem.subtotal;
                } else {
                    console.warn(`Book ${item.bookId} not found, creating placeholder`);
                    // If book not found, create a placeholder but still include it
                    const cartItem = {
                        bookId: item.bookId,
                        title: 'Book Not Available',
                        author: 'Unknown Author',
                        price: 0,
                        thumbnail: 'https://via.placeholder.com/80x120/CCCCCC/666666?text=No+Image',
                        quantity: item.quantity,
                        subtotal: 0
                    };
                    
                    cartWithBookDetails.items.push(cartItem);
                }
            } catch (error) {
                console.error(`Error fetching book ${item.bookId}:`, error);
                // Create placeholder for failed items
                const cartItem = {
                    bookId: item.bookId,
                    title: 'Error Loading Book',
                    author: 'Unknown Author',
                    price: 0,
                    thumbnail: 'https://via.placeholder.com/80x120/CCCCCC/666666?text=Error',
                    quantity: item.quantity,
                    subtotal: 0
                };
                
                cartWithBookDetails.items.push(cartItem);
            }
        }
        
        cartWithBookDetails.totalAmount = totalAmount;
        return cartWithBookDetails;
    } catch (error) {
        console.error('Error in getCart:', error);
        throw new Error('Failed to get cart');
    }
};

const removeFromCart = async (userId, googleBookId) => {
    try {
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }
        
        // Remove item from cart
        cart.items = cart.items.filter(item => item.bookId.toString() !== googleBookId);
        
        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        throw new Error('Failed to remove item from cart');
    }
};

const clearCart = async (userId) => {
    try {
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // Create empty cart if none exists
            cart = await Cart.create({
                userId,
                items: []
            });
        } else {
            // Clear existing cart
            cart.items = [];
            await cart.save();
        }
        
        return {
            message: "Cart cleared successfully",
            cart: cart
        };
    } catch (error) {
        console.error('Error in clearCart:', error);
        throw new Error('Failed to clear cart');
    }
};

const updateCartItemQuantity = async (userId, bookId, quantity) => {
    try {
        console.log(`Updating cart item quantity for user: ${userId}, book: ${bookId}, quantity: ${quantity}`);
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            throw new Error('Cart not found');
        }
        
        const itemIndex = cart.items.findIndex(item => item.bookId === bookId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        // Update the quantity directly (don't add to existing)
        cart.items[itemIndex].quantity = quantity;
        
        await cart.save();
        console.log(`Cart item quantity updated successfully`);
        
        return cart;
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        throw new Error(error.message || 'Failed to update cart item quantity');
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity
};