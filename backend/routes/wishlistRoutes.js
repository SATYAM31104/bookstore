const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

// All wishlist routes require authentication
router.use(authMiddleware);

// GET /api/wishlist - Get user's wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist/add - Add book to wishlist
router.post('/add', wishlistController.addToWishlist);

// DELETE /api/wishlist/remove/:bookId - Remove book from wishlist
router.delete('/remove/:bookId', wishlistController.removeFromWishlist);

// DELETE /api/wishlist/clear - Clear entire wishlist
router.delete('/clear', wishlistController.clearWishlist);

// POST /api/wishlist/move-to-cart/:bookId - Move book from wishlist to cart
router.post('/move-to-cart/:bookId', wishlistController.moveToCart);

module.exports = router;