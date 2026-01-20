# 📚 Bookstore Frontend

React frontend for a complete bookstore e-commerce application with modern UI and state management.

## 🚀 Features

- **User Authentication**: Login, register, password reset
- **Book Catalog**: Browse and search books
- **Shopping Cart**: Add, update, remove items
- **Order Management**: View order history
- **Wishlist**: Save favorite books
- **Responsive Design**: Works on all devices
- **State Management**: Context API for global state
- **Modern UI**: Clean, professional design

## 🛠️ Tech Stack

- **Framework**: React 18
- **State Management**: Context API
- **Routing**: React Router v6
- **Styling**: CSS3 with custom properties
- **HTTP Client**: Fetch API
- **Build Tool**: Create React App

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/          # Authentication forms
│   ├── books/         # Book-related components
│   ├── cart/          # Shopping cart components
│   ├── checkout/      # Checkout process
│   └── common/        # Shared components
├── context/           # Global state management
│   ├── AuthContext.js    # User authentication
│   ├── CartContext.js    # Shopping cart
│   └── WishlistContext.js # Wishlist
├── pages/             # Full page components
├── services/          # API communication
├── styles/            # CSS files
├── utils/             # Helper functions
├── App.js             # Main app component
└── index.js           # React entry point
```

## 🎨 Key Components

### State Management
- **AuthContext**: Handles user authentication, JWT tokens
- **CartContext**: Manages shopping cart state and operations
- **WishlistContext**: Manages wishlist functionality

### Pages
- **HomePage**: Book catalog with search and filtering
- **LoginPage**: User authentication
- **CartPage**: Shopping cart management
- **CheckoutPage**: Order placement
- **OrdersPage**: Order history
- **ProfilePage**: User account management

### Components
- **Header**: Navigation with search and user menu
- **BookCard**: Individual book display
- **BookGrid**: Responsive book layout
- **CartItem**: Shopping cart item management

## 🔗 API Integration

The frontend communicates with the backend API for:
- User authentication
- Book data from Google Books API
- Shopping cart operations
- Order management
- Wishlist functionality

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly interface

## 🎯 Features Showcase

### Authentication System
- Secure login/register forms
- JWT token management
- Persistent sessions
- Password reset functionality

### Shopping Experience
- Book search and filtering
- Add to cart with quantity selection
- Wishlist for saving favorites
- Complete checkout process
- Order history tracking

### User Interface
- Clean, modern design
- Intuitive navigation
- Loading states and error handling
- Responsive across all devices

## 🔗 Related Repositories

- **Backend API**: [Bookstore Backend](https://github.com/YOUR_USERNAME/bookstore-backend)

## 🚀 Deployment

This project can be deployed to:
- **Vercel**: Optimized for React applications
- **Netlify**: Easy static site deployment
- **GitHub Pages**: Free hosting option
- **Firebase Hosting**: Google's hosting platform

## 📄 License

This project is for educational purposes.
