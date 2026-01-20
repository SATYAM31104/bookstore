const wishlistService = require('../services/wishlistService');
const cartService = require('../services/cartService');

const getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user._id);
        return res.status(200).json({ wishlist });
    } catch (error) {
        console.error('Error in getWishlist controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const wishlist = await wishlistService.addToWishlist(req.user._id, bookId);
        return res.status(200).json({ 
            message: 'Book added to wishlist successfully',
            wishlist 
        });
    } catch (error) {
        console.error('Error in addToWishlist controller:', error);
        
        if (error.message === 'Book already in wishlist') {
            return res.status(400).json({ error: error.message });
        }
        
        return res.status(500).json({ error: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const wishlist = await wishlistService.removeFromWishlist(req.user._id, bookId);
        return res.status(200).json({ 
            message: 'Book removed from wishlist successfully',
            wishlist 
        });
    } catch (error) {
        console.error('Error in removeFromWishlist controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.clearWishlist(req.user._id);
        return res.status(200).json({ 
            message: 'Wishlist cleared successfully',
            wishlist 
        });
    } catch (error) {
        console.error('Error in clearWishlist controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const moveToCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const wishlist = await wishlistService.moveToCart(req.user._id, bookId, cartService);
        return res.status(200).json({ 
            message: 'Book moved to cart successfully',
            wishlist 
        });
    } catch (error) {
        console.error('Error in moveToCart controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart
};