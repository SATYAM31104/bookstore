import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { getCartItemCount } = useCart();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'My Orders', path: '/orders' }
  ];

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getUserOrders(user.token);
      setOrders(data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    switch (statusLower) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'processing': return '#9C27B0';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Header user={user} cartItemCount={getCartItemCount()} />
        <Breadcrumb items={breadcrumbItems} />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
              <p>Loading your orders...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Header user={user} cartItemCount={getCartItemCount()} />
        <Breadcrumb items={breadcrumbItems} />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <h3 style={{ color: 'var(--error-red)' }}>Error</h3>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={fetchOrders}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} cartItemCount={getCartItemCount()} />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="main-content">
        <div className="container">
          <div className="orders-page">
            <h1>My Orders</h1>
            
            {orders.length === 0 ? (
              <div className="empty-orders">
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                  <h3>No orders yet</h3>
                  <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => window.location.href = '/'}
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-id">Order #{order._id.slice(-8)}</div>
                        <div className="order-date">{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status || order.orderStatus) }}
                        >
                          {(order.status || order.orderStatus).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="order-item-image">
                            <img 
                              src={item.thumbnail || 'https://via.placeholder.com/60x90/C85A5A/FFFFFF?text=Book'} 
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
                    
                    <div className="order-footer">
                      <div className="order-address">
                        <strong>Delivery Address:</strong>
                        <div>
                          {order.shippingAddress.name}, {order.shippingAddress.street}, 
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </div>
                      </div>
                      <div className="order-total">
                        <strong>Total: Rs. {order.totalAmount || order.total}</strong>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      <button className="btn btn-outline btn-sm">
                        Track Order
                      </button>
                      {(order.status || order.orderStatus).toLowerCase() === 'delivered' && (
                        <button className="btn btn-secondary btn-sm">
                          Rate & Review
                        </button>
                      )}
                      {['pending', 'confirmed'].includes((order.status || order.orderStatus).toLowerCase()) && (
                        <button className="btn btn-ghost btn-sm">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;