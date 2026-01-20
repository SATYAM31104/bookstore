const bookService = require('../services/bookService');

const getBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        console.error('Error in getBooks:', error);
        return res.status(500).json({
            message: 'Failed to fetch books',
            error: error.message
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query; 
        if (!q) {
            return res.status(400).json({ 
                message: 'Search query is required. Use ?q=your_search_term' 
            });
        }
        
        const books = await bookService.searchBooks(q);
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error in searchBooks:', error);
        return res.status(500).json({
            message: 'Failed to search books',
            error: error.message
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ 
                message: 'Book ID is required' 
            });
        }
        
        const book = await bookService.getBookById(bookId);
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error in getBookById:', error.message);
        
        // Handle specific error types
        if (error.message.includes('not found')) {
            return res.status(404).json({
                message: 'Book not found',
                error: error.message
            });
        } else if (error.message.includes('unavailable')) {
            return res.status(503).json({
                message: 'Service temporarily unavailable',
                error: error.message
            });
        } else {
            return res.status(500).json({
                message: 'Failed to fetch book details',
                error: error.message
            });
        }
    }
};

module.exports = {
    getBooks,
    searchBooks,
    getBookById
};