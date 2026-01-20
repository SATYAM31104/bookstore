const express = require('express');
const { 
    addReview, 
    getReviewsByBook, 
    getUserReview, 
    updateReview, 
    deleteReview 
} = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes (no auth required)
router.get('/book/:bookId', getReviewsByBook);           // GET /api/reviews/book/ABC123

// Protected routes (auth required)
router.use(authMiddleware);

router.post('/', addReview);                             // POST /api/reviews
router.get('/user/:bookId', getUserReview);             // GET /api/reviews/user/ABC123
router.put('/:reviewId', updateReview);                  // PUT /api/reviews/123
router.delete('/:reviewId', deleteReview);              // DELETE /api/reviews/123

module.exports = router;