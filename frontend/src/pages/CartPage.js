import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const { cartItems, loading, clearCart, getCartItemCount } = useCart();
  const { user } = useAuth();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Shopping Cart', path: '/cart' }
  ];

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="App">
      <Header user={user} cartItemCount={getCartItemCount()} />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="main-content">
        <div className="container">
          <div className="cart-page">
            <div className="cart-header">
              <h1>Shopping Cart</h1>
              {cartItems.length > 0 && (
                <button 
                  className="btn btn-ghost"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Clear Cart
                </button>
              )}
            </div>

            {loading && (
              <div className="text-center" style={{ padding: '48px 0' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
                <p>Loading cart...</p>
              </div>
            )}

            {!loading && cartItems.length === 0 && (
              <div className="empty-cart">
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added any books to your cart yet.</p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => window.location.href = '/'}
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            )}

            {!loading && cartItems.length > 0 && (
              <div className="cart-content">
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <CartItem key={item.bookId} item={item} />
                  ))}
                </div>
                
                <div className="cart-sidebar">
                  <CartSummary />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;