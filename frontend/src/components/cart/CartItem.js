import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, loading } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    // Ensure quantity is within reasonable bounds
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(item.bookId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.bookId);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={imageError ? 'https://via.placeholder.com/80x120/CCCCCC/666666?text=No+Image' : (item.thumbnail || 'https://via.placeholder.com/80x120/C85A5A/FFFFFF?text=Book')} 
          alt={item.title}
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-author">by {item.author}</p>
        <p className="cart-item-price">Rs. {item.price}</p>
      </div>
      
      <div className="cart-item-controls">
        <div className="quantity-control">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            className="quantity-input"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            min="1"
            max="99"
            disabled={loading}
          />
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={loading}
          >
            +
          </button>
        </div>
        
        <div className="cart-item-total">
          Rs. {itemTotal}
        </div>
        
        <button 
          className="btn btn-ghost btn-sm"
          onClick={handleRemove}
          disabled={loading}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;