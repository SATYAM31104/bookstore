const Review = require('../models/Review');

const addReview = async (userId, bookId, rating, comment) => {
    try {
        // Check if review already exists
        const existingReview = await Review.findOne({ userId, bookId });
        
        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
            await existingReview.save();
            return existingReview;
        } else {
            // Create new review
            const review = await Review.create({
                userId,
                bookId,
                rating,
                comment
            });
            return review;
        }
    } catch (error) {
        console.error('Error in addReview:', error);
        throw new Error('Failed to add review');
    }
};

const getReviewsByBook = async (bookId) => {
    try {
        const reviews = await Review.find({ bookId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        return reviews;
    } catch (error) {
        console.error('Error in getReviewsByBook:', error);
        throw new Error('Failed to get reviews');
    }
};

const getUserReview = async (userId, bookId) => {
    try {
        const review = await Review.findOne({ userId, bookId })
            .populate('userId', 'name');
        return review;
    } catch (error) {
        console.error('Error in getUserReview:', error);
        throw new Error('Failed to get user review');
    }
};

const updateReview = async (userId, reviewId, rating, comment) => {
    try {
        const review = await Review.findOne({ _id: reviewId, userId });
        
        if (!review) {
            throw new Error('Review not found or unauthorized');
        }
        
        review.rating = rating;
        review.comment = comment;
        await review.save();
        
        return review;
    } catch (error) {
        console.error('Error in updateReview:', error);
        throw new Error('Failed to update review');
    }
};

const deleteReview = async (userId, reviewId) => {
    try {
        const review = await Review.findOne({ _id: reviewId, userId });
        
        if (!review) {
            throw new Error('Review not found or unauthorized');
        }
        
        await Review.findByIdAndDelete(reviewId);
        return { message: 'Review deleted successfully' };
    } catch (error) {
        console.error('Error in deleteReview:', error);
        throw new Error('Failed to delete review');
    }
};

module.exports = {
    addReview,
    getReviewsByBook,
    getUserReview,
    updateReview,
    deleteReview
};