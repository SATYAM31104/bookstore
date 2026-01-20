import React from 'react';
import BookCard from './BookCard';

const BookGrid = ({ books = [], loading = false }) => {
  if (loading) {
    return (
      <div className="books-grid">
        {/* Loading skeleton */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="book-card" style={{ opacity: 0.6 }}>
            <div 
              className="book-card-image" 
              style={{ backgroundColor: '#f0f0f0' }}
            />
            <div className="book-card-content">
              <div 
                style={{ 
                  height: '20px', 
                  backgroundColor: '#f0f0f0', 
                  marginBottom: '8px',
                  borderRadius: '4px'
                }} 
              />
              <div 
                style={{ 
                  height: '16px', 
                  backgroundColor: '#f0f0f0', 
                  marginBottom: '8px',
                  borderRadius: '4px',
                  width: '70%'
                }} 
              />
              <div 
                style={{ 
                  height: '18px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  width: '50%'
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center" style={{ padding: '48px 0' }}>
        <h3>No books found</h3>
        <p className="text-secondary">Try adjusting your search or browse our catalog.</p>
      </div>
    );
  }

  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard 
          key={book.googleBookId || book.id || book.title} 
          book={book} 
        />
      ))}
    </div>
  );
};

export default BookGrid;