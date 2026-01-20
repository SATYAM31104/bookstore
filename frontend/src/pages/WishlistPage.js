import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';

const WishlistPage = () => {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist, loading } = useWishlist();
  const cartContext = useCart();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Wishlist', path: '/wishlist' }
  ];

  const handleRemoveFromWishlist = async (bookId, title) => {
    try {
      await removeFromWishlist(bookId);
      alert(`💔 Removed "${title}" from your wishlist!`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert(`❌ Failed to remove "${title}" from wishlist. Please try again.`);
    }
  };

  const handleMoveToCart = async (bookId, title) => {
    try {
      await moveToCart(bookId, cartContext);
      alert(`🛒 Moved "${title}" to your cart!`);
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert(`❌ Failed to move "${title}" to cart. Please try again.`);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
        alert('🗑️ Wishlist cleared successfully!');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        alert('❌ Failed to clear wishlist. Please try again.');
      }
    }
  };

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <h3>Please Login</h3>
              <p>You need to login to view your wishlist.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="main-content">
        <div className="container">
          <div className="wishlist-page">
            <div className="page-header">
              <h1>My Wishlist ({wishlistItems.length} items)</h1>
              {wishlistItems.length > 0 && (
                <button 
                  className="btn btn-ghost"
                  onClick={handleClearWishlist}
                  disabled={loading}
                >
                  Clear All
                </button>
              )}
            </div>

            {loading && wishlistItems.length === 0 && (
              <div className="text-center" style={{ padding: '48px 0' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
                <p>Loading your wishlist...</p>
              </div>
            )}

            {!loading && wishlistItems.length === 0 && (
              <div className="empty-wishlist">
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>💖</div>
                  <h3>Your wishlist is empty</h3>
                  <p>Save books you love for later by adding them to your wishlist.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                  >
                    Browse Books
                  </button>
                </div>
              </div>
            )}

            {wishlistItems.length > 0 && (
              <div className="wishlist-items">
                {wishlistItems.map((item) => (
                  <div key={item.bookId} className="wishlist-item">
                    <div className="wishlist-item-image">
                      <img 
                        src={item.thumbnail || 'https://via.placeholder.com/120x180/CCCCCC/666666?text=No+Image'} 
                        alt={item.title}
                        onClick={() => handleViewBook(item.bookId)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    
                    <div className="wishlist-item-details">
                      <h3 
                        className="wishlist-item-title"
                        onClick={() => handleViewBook(item.bookId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.title}
                      </h3>
                      <p className="wishlist-item-author">by {item.author}</p>
                      <div className="wishlist-item-price">Rs. {item.price}</div>
                      <div className="wishlist-item-added">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="wishlist-item-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMoveToCart(item.bookId, item.title)}
                        disabled={loading}
                      >
                        🛒 Move to Cart
                      </button>
                      <button 
                        className="btn btn-ghost"
                        onClick={() => handleRemoveFromWishlist(item.bookId, item.title)}
                        disabled={loading}
                      >
                        🗑️ Remove
                      </button>
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

export default WishlistPage;