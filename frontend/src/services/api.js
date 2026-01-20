const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
    
    // Log detailed error for debugging
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorMessage
    });
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  }
};

// Books API
export const booksAPI = {
  getAllBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books`);
    return handleResponse(response);
  },

  searchBooks: async (query) => {
    const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  getBookById: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    return handleResponse(response);
  }
};

// Cart API
export const cartAPI = {
  getCart: async (token) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  addToCart: async (token, bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ bookId, quantity })
    });
    return handleResponse(response);
  },

  updateQuantity: async (token, bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update/${bookId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
  },

  removeFromCart: async (token, bookId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  clearCart: async (token) => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  }
};

// Reviews API
export const reviewsAPI = {
  getBookReviews: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/book/${bookId}`);
    return handleResponse(response);
  },

  addReview: async (token, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(response);
  },

  updateReview: async (token, reviewId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(response);
  },

  deleteReview: async (token, reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  }
};

// Orders API
export const ordersAPI = {
  createOrder: async (token, orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  getUserOrders: async (token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  getOrderById: async (token, orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  }
};

// Addresses API
export const addressesAPI = {
  getAddresses: async (token) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  addAddress: async (token, addressData) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  updateAddress: async (token, addressId, addressData) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  deleteAddress: async (token, addressId) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  setDefaultAddress: async (token, addressId) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/default`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  }
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async (token) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  addToWishlist: async (token, bookId) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ bookId })
    });
    return handleResponse(response);
  },

  removeFromWishlist: async (token, bookId) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/remove/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  clearWishlist: async (token) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  },

  moveToCart: async (token, bookId) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/move-to-cart/${bookId}`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    });
    return handleResponse(response);
  }
};

export default {
  authAPI,
  booksAPI,
  cartAPI,
  reviewsAPI,
  ordersAPI,
  addressesAPI,
  wishlistAPI
};