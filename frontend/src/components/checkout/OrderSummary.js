import React from 'react';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({ selectedAddress, selectedPaymentMethod }) => {
  const { cartItems, getCartTotal, getCartItemCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const codCharges = selectedPaymentMethod?.id === 'cod' ? 25 : 0;
  const total = subtotal + shipping + tax + codCharges;
  const itemCount = getCartItemCount();

  return (
    <div className="order-summary">
      <div className="card">
        <div className="card-header">
          <h3>Order Summary</h3>
        </div>
        
        <div className="card-body">
          {/* Order Items */}
          <div className="order-items">
            <h4>Items ({itemCount})</h4>
            {cartItems.map((item) => (
              <div key={item.bookId} className="order-item">
                <div className="order-item-image">
                  <img 
                    src={item.thumbnail || 'https://via.placeholder.com/50x75/C85A5A/FFFFFF?text=Book'} 
                    alt={item.title}
                  />
                </div>
                <div className="order-item-details">
                  <div className="order-item-title">{item.title}</div>
                  <div className="order-item-author">by {item.author}</div>
                  <div className="order-item-quantity">Qty: {item.quantity}</div>
                </div>
                <div className="order-item-price">
                  Rs. {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <hr />

          {/* Delivery Address */}
          {selectedAddress && (
            <div className="delivery-address">
              <h4>Delivery Address</h4>
              <div className="address-summary">
                <div className="address-name">{selectedAddress.name}</div>
                <div className="address-text">
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </div>
                <div className="address-phone">Phone: {selectedAddress.phone}</div>
              </div>
            </div>
          )}

          <hr />

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            
            <div className="price-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
            </div>
            
            <div className="price-row">
              <span>Tax (GST 18%)</span>
              <span>Rs. {tax}</span>
            </div>

            {codCharges > 0 && (
              <div className="price-row">
                <span>COD Charges</span>
                <span>Rs. {codCharges}</span>
              </div>
            )}
            
            {shipping === 0 && (
              <div className="shipping-note">
                <small className="text-success">
                  🎉 You saved Rs. 50 on shipping!
                </small>
              </div>
            )}
            
            <hr />
            
            <div className="price-row total-row">
              <strong>
                <span>Total</span>
                <span>Rs. {total}</span>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;