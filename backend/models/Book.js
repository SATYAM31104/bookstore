const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true
    },
    authors: [String],
    description: String,
    categories: [String],
    imageLinks: {
        smallThumbnail: String,
        thumbnail: String
    },
    publishedDate: String,
    pageCount: Number,
    price: {
        type: Number,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);