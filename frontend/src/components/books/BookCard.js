import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/book/${book.googleBookId || book.id}`);
  };

  const formatPrice = (price) => {
    return `Rs. ${price}`;
  };

  const getStockStatus = () => {
    // This would come from your backend data
    // For now, we'll simulate it
    if (book.stock === 0) return 'out-of-stock';
    if (book.isNew) return 'new';
    if (book.onSale) return 'sale';
    return null;
  };

  const stockStatus = getStockStatus();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="book-card" onClick={handleClick}>
      {/* Stock Status Badge */}
      {stockStatus && (
        <div className={`book-status ${stockStatus}`}>
          {stockStatus === 'out-of-stock' && 'Out of Stock'}
          {stockStatus === 'new' && 'New'}
          {stockStatus === 'sale' && 'Sale'}
        </div>
      )}

      {/* Book Image */}
      <div style={{ position: 'relative', backgroundColor: '#f0f0f0' }}>
        {!imageLoaded && (
          <div 
            className="book-card-image"
            style={{ 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}
          >
            📚
          </div>
        )}
        <img
          src={imageError ? 'https://via.placeholder.com/200x250/CCCCCC/666666?text=No+Image' : book.thumbnail}
          alt={book.title}
          className="book-card-image"
          style={{ display: imageLoaded ? 'block' : 'none' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Book Content */}
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author || 'Unknown Author'}</p>
        
        <div className="book-card-price">
          {formatPrice(book.price)}
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="book-card-original-price">
              {formatPrice(book.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;