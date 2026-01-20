# 📚 Bookstore Backend API

Express.js REST API for a complete bookstore application with MongoDB and JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based login/register system
- **Book Management**: Google Books API integration
- **Shopping Cart**: Add, update, remove items
- **Order System**: Complete order processing
- **Wishlist**: Save favorite books
- **Address Management**: Multiple shipping addresses
- **Review System**: Book ratings and reviews
- **Security**: JWT tokens, password hashing, CORS

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: Google Books API
- **Security**: bcryptjs, CORS

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm start
```

## 🌍 Environment Variables

Create a `.env` file with:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3001
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Books
- `GET /api/books` - Get all books (Google Books)
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/:id` - Get single book

### Cart (Protected)
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:bookId` - Update quantity
- `DELETE /api/cart/remove/:bookId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders (Protected)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order

### Wishlist (Protected)
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:bookId` - Remove from wishlist

### Addresses (Protected)
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Reviews (Protected)
- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🏗️ Project Structure

```
backend/
├── controllers/        # Route handlers
├── models/            # Database schemas
├── routes/            # API endpoints
├── services/          # Business logic
├── middlewares/       # Auth & error handling
├── config/            # Database configuration
├── utils/             # Helper functions
├── seeds/             # Database seeders
├── .env.example       # Environment template
├── server.js          # Entry point
└── package.json       # Dependencies
```

## 🔗 Related Repositories

- **Frontend**: [Bookstore Frontend](https://github.com/YOUR_USERNAME/bookstore-frontend)

## 📄 License

This project is for educational purposes.
