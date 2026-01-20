const cartService = require('../services/cartService');

const addToCart = async (req, res) => {
    try {
        const { bookId, quantity = 1 } = req.body;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }

        const cart = await cartService.addToCart(req.user._id, bookId, quantity);
        return res.status(201).json({ 
            message: 'Item added to cart successfully',
            cart 
        });
    } catch (error) {
        console.error('Error in addToCart controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        return res.status(200).json({ cart });
    } catch (error) {
        console.error('Error in getCart controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }

        const cart = await cartService.removeFromCart(req.user._id, bookId);
        return res.status(200).json({ 
            message: 'Item removed from cart successfully',
            cart 
        });
    } catch (error) {
        console.error('Error in removeFromCart controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const result = await cartService.clearCart(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in clearCart controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { quantity } = req.body;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }

        const cart = await cartService.updateCartItemQuantity(req.user._id, bookId, quantity);
        return res.status(200).json({ 
            message: 'Cart item quantity updated successfully',
            cart 
        });
    } catch (error) {
        console.error('Error in updateCartItemQuantity controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity
};