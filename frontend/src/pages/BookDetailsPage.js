import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { booksAPI } from '../services/api';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';
import BookDetails from '../components/books/BookDetails';
import BookReviews from '../components/books/BookReviews';

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const { getCartItemCount, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const mockReviews = [
    {
      id: 1,
      author: 'Arshad Chiku',
      rating: 5,
      comment: 'Great product! The experience I could have never gotten from any other website and it is working and amazing.',
      date: '2024-01-15'
    },
    {
      id: 2,
      author: 'Shivam Kushwah',
      rating: 4,
      comment: 'Excellent book with great content. Highly recommended for anyone interested in this topic.',
      date: '2024-01-10'
    }
  ];

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching book details for ID:', bookId);
        
        // Use the new individual book endpoint
        const bookData = await booksAPI.getBookById(bookId);
        console.log('Book data from API:', bookData);
        
        if (bookData) {
          // Add additional properties that might be missing
          const bookWithExtras = {
            ...bookData,
            stock: Math.floor(Math.random() * 15) + 5, // Random stock between 5-20
            rating: bookData.averageRating || (Math.random() * 2 + 3).toFixed(1), // Use API rating or random
            totalReviews: Math.floor(Math.random() * 100) + 10 // Random reviews between 10-110
          };
          setBook(bookWithExtras);
          console.log('Set book with extras:', bookWithExtras);
        } else {
          setError('Book not found');
        }
        
        setReviews(mockReviews);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError(`Failed to load book details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleAddToCart = async (book, quantity) => {
    if (!user) {
      // Show a more user-friendly message and redirect to login
      if (window.confirm('You need to login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    
    try {
      setAddingToCart(true);
      console.log('Adding to cart:', { book: book.title, quantity, bookId: book.googleBookId });
      
      await addToCart(book, quantity);
      
      // Show success message with better formatting
      alert(`✅ SUCCESS!\n\nAdded ${quantity} x "${book.title}" to your cart!\n\nYou can view your cart by clicking the cart icon in the header.`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Show more specific error messages
      let errorMessage = error.message;
      if (errorMessage.includes('login again')) {
        errorMessage = 'Your session has expired. Please login again.';
        // Optionally redirect to login
        setTimeout(() => {
          if (window.confirm('Your session has expired. Would you like to login again?')) {
            navigate('/login');
          }
        }, 2000);
      }
      
      alert(`❌ FAILED!\n\nCouldn't add "${book.title}" to cart.\n\nError: ${errorMessage}\n\nPlease try again.`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (book) => {
    if (!user) {
      if (window.confirm('You need to login to add items to wishlist. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    
    try {
      setAddingToWishlist(true);
      
      if (isInWishlist(book.googleBookId)) {
        // Remove from wishlist
        await removeFromWishlist(book.googleBookId);
        alert(`💔 Removed "${book.title}" from your wishlist!`);
      } else {
        // Add to wishlist
        await addToWishlist(book);
        alert(`💖 Added "${book.title}" to your wishlist!`);
      }
    } catch (error) {
      console.error('Error with wishlist:', error);
      alert(`❌ FAILED!\n\n${error.message}\n\nPlease try again.`);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleAddReview = (reviewData) => {
    if (!user) {
      if (window.confirm('You need to login to write reviews. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    
    // TODO: Implement add review API call
    const newReview = {
      id: reviews.length + 1,
      author: user.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString()
    };
    
    setReviews(prev => [newReview, ...prev]);
    alert('✅ Review added successfully!');
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Books', path: '/' },
    { label: book?.title || 'Book Details', path: `/book/${bookId}` }
  ];

  if (loading) {
    return (
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
              <p>Loading book details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="App">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <h3 style={{ color: 'var(--error-red)' }}>Error</h3>
              <p>{error || 'Book not found'}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Back to Home
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
          <div className="book-details-page">
            <BookDetails 
              book={book}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              addingToCart={addingToCart}
              addingToWishlist={addingToWishlist}
              isInWishlist={isInWishlist(book.googleBookId)}
            />
            
            <BookReviews 
              bookId={bookId}
              reviews={reviews}
              onAddReview={handleAddReview}
              user={user}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailsPage;