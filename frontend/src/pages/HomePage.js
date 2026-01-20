import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { booksAPI } from '../services/api';
import Header from '../components/common/Header';
import BookGrid from '../components/books/BookGrid';

const HomePage = () => {
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchBooks();
  }, [searchQuery]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (searchQuery) {
        data = await booksAPI.searchBooks(searchQuery);
      } else {
        data = await booksAPI.getAllBooks();
      }
      
      setBooks(data.books || data || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    
    const sortedBooks = [...books].sort((a, b) => {
      switch (newSortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
    
    setBooks(sortedBooks);
  };

  return (
    <div className="App">
      <Header onSearch={handleSearch} />
      
      <main className="main-content">
        <div className="container">
          <div className="home-page">
            {/* Page Title and Sort */}
            <div className="page-title">
              <h1>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Books'} 
                <span style={{ color: '#666', fontSize: '16px' }}>
                  {searchQuery ? ` (${books.length} found)` : ' (Best Seller)'}
                </span>
              </h1>
              
              <div className="sort-dropdown">
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Sort by relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center" style={{ padding: '48px 0' }}>
                <h3 style={{ color: 'var(--error-red)' }}>Error</h3>
                <p>{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={fetchBooks}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty Search Results */}
            {!loading && !error && searchQuery && books.length === 0 && (
              <div className="text-center" style={{ padding: '48px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
                <h3>No books found</h3>
                <p>We couldn't find any books matching "{searchQuery}". Try a different search term.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/'}
                >
                  Browse All Books
                </button>
              </div>
            )}

            {/* Books Grid */}
            {!error && <BookGrid books={books} loading={loading} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;