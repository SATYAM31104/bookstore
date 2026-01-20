const Book = require('../models/Book');
const connectDB = require('../config/db');
require('dotenv').config();

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy & proven way to build good habits.",
    price: 499,
    genre: "Self-Help",
    averageRating: 0
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    price: 399,
    genre: "Productivity",
    averageRating: 0
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    price: 699,
    genre: "Programming",
    averageRating: 0
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel set in the Jazz Age.",
    price: 299,
    genre: "Classic Fiction",
    averageRating: 0
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel.",
    price: 349,
    genre: "Dystopian Fiction",
    averageRating: 0
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first book in the Harry Potter series.",
    price: 599,
    genre: "Fantasy",
    averageRating: 0
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence.",
    price: 399,
    genre: "Classic Fiction",
    averageRating: 0
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy adventure about Bilbo Baggins.",
    price: 449,
    genre: "Fantasy",
    averageRating: 0
  }
];

const seedBooks = async () => {
  try {
    await connectDB();
    
    await Book.deleteMany({});
    console.log("Old books cleared");

    await Book.insertMany(books);
    console.log("Books inserted successfully");

    process.exit(0);
  } catch (error) {
    console.log("Seeding failed", error);
    process.exit(1);
  }
};

seedBooks();