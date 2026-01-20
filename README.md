# 📚 MERN Stack Bookstore

A complete full-stack e-commerce bookstore application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Password reset functionality
- Persistent sessions

### 📚 Book Management
- Google Books API integration
- Real-time book catalog
- Advanced search functionality
- Book details with reviews

### 🛒 E-commerce Features
- Shopping cart management
- Order processing and history
- Wishlist functionality
- Address management
- Multiple payment methods
- Responsive checkout process

## 🛠️ Tech Stack

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: Google Books API
- **Security**: bcryptjs, CORS

### Frontend (`/frontend`)
- **Framework**: React 18
- **State Management**: Context API
- **Routing**: React Router v6
- **Styling**: CSS3 with custom properties
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App

## 📁 Project Structure

```
bookstore/
├── backend/                 # Express.js API Server
│   ├── controllers/        # Route handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middlewares/       # Auth & error handling
│   ├── config/            # Database configuration
│   ├── utils/             # Helper functions
│   ├── .env.example       # Environment template
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
├── frontend/              # React Application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # State management
│   │   ├── services/     # API communication
│   │   ├── styles/       # CSS files
│   │   └── utils/        # Helper functions
│   ├── .env.example      # Environment template
│   └── package.json      # Frontend dependencies
├── README.md             # This file
└── package.json          # Root dependencies
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/SATYAM31104/bookstore.git
cd bookstore
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

The backend server will start on `http://localhost:8000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The frontend application will start on `http://localhost:3000`

### 4. Environment Configuration

#### Backend (.env)
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Books
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/:id` - Get single book

### Cart (Protected)
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:bookId` - Update quantity
- `DELETE /api/cart/remove/:bookId` - Remove item

### Orders (Protected)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order

### Wishlist (Protected)
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:bookId` - Remove from wishlist

## 🎨 Key Features Showcase

### Modern React Architecture
- Functional components with hooks
- Context API for global state management
- Custom hooks for reusable logic
- Responsive design with CSS Grid/Flexbox

### Professional Backend API
- RESTful API design
- JWT authentication middleware
- Error handling and validation
- MongoDB integration with Mongoose

### User Experience
- Intuitive navigation and search
- Real-time cart updates
- Persistent user sessions
- Mobile-responsive design
- Loading states and error handling

## 🚀 Deployment

### Backend Deployment Options
- **Heroku**: Easy Node.js deployment
- **Railway**: Modern platform
- **Render**: Free tier available
- **DigitalOcean**: App Platform

### Frontend Deployment Options
- **Vercel**: Optimized for React
- **Netlify**: Easy static site deployment
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google's platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add new feature"`
5. Push to your branch: `git push origin feature/new-feature`
6. Create a Pull Request

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Google Books API for book data
- MongoDB Atlas for database hosting
- React community for excellent documentation
- Express.js for the robust backend framework

---

**Built with ❤️ using the MERN Stack**
