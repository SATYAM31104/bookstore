import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartSummary = () => {
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over Rs. 500
  const total = subtotal + shipping;
  const itemCount = getCartItemCount();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="cart-summary">
      <div className="card">
        <div className="card-header">
          <h3>Order Summary</h3>
        </div>
        <div className="card-body">
          <div className="summary-row">
            <span>Items ({itemCount})</span>
            <span>Rs. {subtotal}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
          </div>
          
          {shipping === 0 && subtotal <= 500 && (
            <div className="shipping-note">
              <small className="text-success">
                🎉 You got free shipping!
              </small>
            </div>
          )}
          
          {shipping > 0 && (
            <div className="shipping-note">
              <small className="text-secondary">
                Add Rs. {500 - subtotal} more for free shipping
              </small>
            </div>
          )}
          
          <hr />
          
          <div className="summary-row summary-total">
            <strong>
              <span>Total</span>
              <span>Rs. {total}</span>
            </strong>
          </div>
        </div>
        
        <div className="card-footer">
          <button 
            className="btn btn-primary btn-block btn-lg"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <button 
            className="btn btn-outline btn-block"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;