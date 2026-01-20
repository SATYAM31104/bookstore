const express = require('express');
const { addToCart, getCart, removeFromCart, clearCart, updateCartItemQuantity } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.post('/add', addToCart);                    // POST /api/cart/add
router.get('/', getCart);                           // GET /api/cart  
router.put('/update/:bookId', updateCartItemQuantity); // PUT /api/cart/update/ABC123
router.delete('/remove/:bookId', removeFromCart);  // DELETE /api/cart/remove/ABC123
router.delete('/clear', clearCart);                // DELETE /api/cart/clear

module.exports = router;
