import React, { useState } from 'react';
import StarRating from '../common/StarRating';

const BookReviews = ({ bookId, reviews = [], onAddReview, user }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.comment.trim()) {
      onAddReview({
        bookId,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });
      setNewReview({ rating: 5, comment: '' });
      setShowAddReview(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">Customer Feedback</h2>
        {user && (
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAddReview(!showAddReview)}
          >
            {showAddReview ? 'Cancel' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <StarRating 
                  rating={newReview.rating}
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  interactive={true}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Share your thoughts about this book..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setShowAddReview(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center" style={{ padding: '48px 0' }}>
          <p className="text-secondary">No reviews yet. Be the first to review this book!</p>
        </div>
      ) : (
        <div>
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div>
                  <div className="review-author">{review.author || 'Anonymous'}</div>
                  <div className="review-rating">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <div className="review-date">
                  {formatDate(review.date || new Date())}
                </div>
              </div>
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;