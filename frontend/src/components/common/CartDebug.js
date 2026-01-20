import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartDebug = () => {
  const { cartItems, getCartItemCount, getCartTotal, addToCart, clearCart } = useCart();
  const { user } = useAuth();

  const testBook = {
    googleBookId: 'test-book-123',
    title: 'Test Book',
    author: 'Test Author',
    price: 999,
    thumbnail: 'https://via.placeholder.com/200x250/4A90E2/FFFFFF?text=Test+Book'
  };

  const handleTestAddToCart = async () => {
    try {
      await addToCart(testBook, 1);
      alert('✅ Test book added to cart successfully!');
    } catch (error) {
      alert('❌ Failed to add test book to cart: ' + error.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      alert('✅ Cart cleared successfully!');
    } catch (error) {
      alert('❌ Failed to clear cart: ' + error.message);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      border: '2px solid #ccc', 
      borderRadius: '8px', 
      padding: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>🛒 Cart Debug Panel</h4>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>User:</strong> {user ? user.email : 'Not logged in'}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Cart Items:</strong> {getCartItemCount()}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Cart Total:</strong> Rs. {getCartTotal()}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Items in Cart:</strong>
        {cartItems.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#666' }}>No items</div>
        ) : (
          <ul style={{ fontSize: '12px', margin: '4px 0', paddingLeft: '16px' }}>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.title} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={handleTestAddToCart}
          style={{
            padding: '8px 12px',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🧪 Test Add to Cart
        </button>
        
        <button 
          onClick={handleClearCart}
          style={{
            padding: '8px 12px',
            backgroundColor: '#F44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🗑️ Clear Cart
        </button>
      </div>
      
      <div style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default CartDebug;