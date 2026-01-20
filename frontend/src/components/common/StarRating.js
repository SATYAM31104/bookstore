import React from 'react';

const StarRating = ({ rating = 0, onRatingChange, interactive = false, size = 'medium' }) => {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeClasses = {
    small: { fontSize: '14px' },
    medium: { fontSize: '18px' },
    large: { fontSize: '24px' }
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="star-rating" style={sizeClasses[size]}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => handleStarClick(star)}
          style={{ 
            cursor: interactive ? 'pointer' : 'default',
            color: star <= rating ? '#FFD700' : '#E0E0E0'
          }}
        >
          ★
        </span>
      ))}
      {!interactive && (
        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
          ({rating}/5)
        </span>
      )}
    </div>
  );
};

export default StarRating;