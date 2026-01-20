const reviewService = require('../services/reviewService');

const addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;
        
        // Validate required fields
        if (!bookId || !rating) {
            return res.status(400).json({ 
                error: 'Book ID and rating are required' 
            });
        }
        
        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                error: 'Rating must be between 1 and 5' 
            });
        }
        
        const review = await reviewService.addReview(req.user._id, bookId, rating, comment);
        
        return res.status(201).json({
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        console.error('Error in addReview controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getReviewsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const reviews = await reviewService.getReviewsByBook(bookId);
        
        return res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error in getReviewsByBook controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getUserReview = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({ error: 'Book ID is required' });
        }
        
        const review = await reviewService.getUserReview(req.user._id, bookId);
        
        return res.status(200).json({ review });
    } catch (error) {
        console.error('Error in getUserReview controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        
        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required' });
        }
        
        if (!rating) {
            return res.status(400).json({ error: 'Rating is required' });
        }
        
        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                error: 'Rating must be between 1 and 5' 
            });
        }
        
        const review = await reviewService.updateReview(req.user._id, reviewId, rating, comment);
        
        return res.status(200).json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Error in updateReview controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required' });
        }
        
        const result = await reviewService.deleteReview(req.user._id, reviewId);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteReview controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addReview,
    getReviewsByBook,
    getUserReview,
    updateReview,
    deleteReview
};