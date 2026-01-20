const express = require('express');
const { getBooks, searchBooks, getBookById } = require('../controllers/bookController');
const router = express.Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:bookId', getBookById);

module.exports = router;