# 📚 MERN Stack Bookstore

A full-stack e-commerce bookstore application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookstore
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   PORT=3001 npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8000

## 🛠️ Environment Variables

Create `backend/.env` file with:
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3001
```

## 📱 Features

- User Authentication (Register/Login)
- Book Catalog with Google Books API
- Shopping Cart Management
- Order History
- Wishlist Functionality
- Responsive Design
- Real-time State Management

## 🏗️ Tech Stack

**Frontend:**
- React 18
- Context API for state management
- React Router for navigation
- CSS3 with responsive design

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Google Books API integration

## 📦 Project Structure

```
├── backend/          # Express.js API
│   ├── controllers/  # Route handlers
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── services/     # Business logic
│   └── middlewares/  # Auth & error handling
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # State management
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── styles/      # CSS files
└── package.json      # Root dependencies
```

## 🔧 Development

- Backend runs on port 8000
- Frontend runs on port 3001
- MongoDB connection required
- CORS enabled for frontend communication

## 📄 License

This project is for educational purposes.