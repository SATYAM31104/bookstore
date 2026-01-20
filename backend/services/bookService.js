const axios = require('axios');
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const fetchBooksFromGoogle = async (query = 'bestseller', maxResults = 40) => {
    try {
        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: query,
                maxResults: maxResults
            }
        });

        if (!response.data.items) {
            return [];
        }

        const books = response.data.items.map((item) => {
            const info = item.volumeInfo;
            return {
                googleBookId: item.id,
                title: info.title || 'Unknown Title',
                author: info.authors?.[0] || 'Unknown Author',
                description: info.description || 'No description available',
                genre: info.categories?.[0] || 'General',
                averageRating: info.averageRating || 0,
                thumbnail: info.imageLinks?.thumbnail || null,
                price: Math.floor(Math.random() * 400) + 200, // mock price (₹200-600)
                publishedDate: info.publishedDate || null,
                pageCount: info.pageCount || null
            };
        });

        return books;
    } catch (error) {
        console.error('Error fetching books from Google API:', error);
        throw new Error('Failed to fetch books from Google Books API');
    }
};

const getAllBooks = async () => {
    try {
        // Pure Google Books - always fetch fresh data
        const books = await fetchBooksFromGoogle();
        return books;
    } catch (error) {
        console.error('Error in getAllBooks:', error);
        throw new Error('Failed to get books');
    }
};

// Search books by query
const searchBooks = async (query) => {
    try {
        const books = await fetchBooksFromGoogle(query, 20);
        return books;
    } catch (error) {
        console.error('Error in searchBooks:', error);
        throw new Error('Failed to search books');
    }
};

// Get individual book by Google Books ID
const getBookById = async (bookId) => {
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_API}/${bookId}`);
        
        if (!response.data) {
            throw new Error('Book not found');
        }

        const item = response.data;
        const info = item.volumeInfo;
        
        const book = {
            googleBookId: item.id,
            title: info.title || 'Unknown Title',
            author: info.authors?.[0] || 'Unknown Author',
            description: info.description || 'No description available',
            genre: info.categories?.[0] || 'General',
            averageRating: info.averageRating || 0,
            thumbnail: info.imageLinks?.thumbnail || null,
            price: Math.floor(Math.random() * 400) + 200, // mock price (₹200-600)
            publishedDate: info.publishedDate || null,
            pageCount: info.pageCount || null
        };

        return book;
    } catch (error) {
        console.error('Error fetching book by ID:', error.message);
        
        // Handle specific Google Books API errors
        if (error.response?.status === 503) {
            throw new Error('Google Books service temporarily unavailable');
        } else if (error.response?.status === 404) {
            throw new Error('Book not found');
        } else if (error.response?.status === 429) {
            throw new Error('Too many requests to Google Books API');
        } else {
            throw new Error('Failed to fetch book details');
        }
    }
};

module.exports = {
    getAllBooks,
    searchBooks,
    fetchBooksFromGoogle,
    getBookById
};