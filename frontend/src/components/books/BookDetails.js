import React, { useState } from 'react';
import StarRating from '../common/StarRating';

const BookDetails = ({ book, onAddToCart, onAddToWishlist, addingToCart = false, addingToWishlist = false, isInWishlist = false }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = [
    book.thumbnail,
    book.thumbnail, // Duplicate for demo
    book.thumbnail,
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(book, quantity);
  };

  const isOutOfStock = book.stock === 0;

  return (
    <div className="book-details-container">
      {/* Left Side - Thumbnails */}
      <div className="book-thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image || 'https://via.placeholder.com/60x90/CCCCCC/666666?text=No+Image'}
            alt={`${book.title} ${index + 1}`}
            className={`book-thumbnail ${selectedImage === index ? 'active' : ''}`}
            onClick={() => setSelectedImage(index)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60x90/CCCCCC/666666?text=No+Image';
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="book-main-content">
        {/* Main Image */}
        <div>
          <img
            src={images[selectedImage] || 'https://via.placeholder.com/300x450/CCCCCC/666666?text=No+Image'}
            alt={book.title}
            className="book-main-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450/CCCCCC/666666?text=No+Image';
            }}
          />
        </div>

        {/* Book Information */}
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by {book.author}</p>

          <div className="book-price">
            Rs. {book.price}
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="book-card-original-price">
                Rs. {book.originalPrice}
              </span>
            )}
          </div>

          <div className={`book-stock-status ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </div>

          {/* Rating */}
          {book.rating && (
            <div className="book-rating" style={{ marginBottom: '16px' }}>
              <StarRating rating={book.rating} />
              <span style={{ marginLeft: '8px', color: '#666' }}>
                ({book.totalReviews || 0} reviews)
              </span>
            </div>
          )}

          <div className="book-description">
            <h3>About This Book</h3>
            <p>{book.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}</p>
          </div>

          <div className="book-actions">
            {!isOutOfStock && (
              <>
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={addingToCart}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={addingToCart}
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={addingToCart}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  style={{ 
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {addingToCart ? (
                    <>
                      <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                      ADDING...
                    </>
                  ) : (
                    <>
                      🛒 ADD TO BAG
                    </>
                  )}
                </button>
              </>
            )}
            
            {isOutOfStock ? (
              <button className="btn btn-primary btn-lg" disabled>
                📧 NOTIFY ME
              </button>
            ) : (
              <button 
                className="btn btn-outline btn-lg"
                onClick={() => onAddToWishlist(book)}
                disabled={addingToCart || addingToWishlist}
                style={{
                  backgroundColor: isInWishlist ? '#ff6b6b' : 'transparent',
                  color: isInWishlist ? 'white' : 'var(--primary-blue)',
                  borderColor: isInWishlist ? '#ff6b6b' : 'var(--primary-blue)'
                }}
              >
                {addingToWishlist ? (
                  <>
                    <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                    {isInWishlist ? 'REMOVING...' : 'ADDING...'}
                  </>
                ) : (
                  <>
                    {isInWishlist ? '💖 IN WISHLIST' : '♡ WISHLIST'}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="book-additional-info" style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
            <p>📦 Free shipping on orders over Rs. 500</p>
            <p>🔄 Easy returns within 30 days</p>
            <p>⚡ Usually ships within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;