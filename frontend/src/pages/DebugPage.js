import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { booksAPI } from '../services/api';

const DebugPage = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      addResult('Login Test', null, 'Starting login test...');
      
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      addResult('Login Test', true, 'Login successful!', result);
    } catch (error) {
      addResult('Login Test', false, `Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAddToCart = async () => {
    try {
      setLoading(true);
      addResult('Add to Cart Test', null, 'Starting add to cart test...');
      
      // Get a book first
      const booksData = await booksAPI.getAllBooks();
      const book = booksData.books?.[0] || booksData[0];
      
      if (!book) {
        addResult('Add to Cart Test', false, 'No books available for testing');
        return;
      }
      
      addResult('Add to Cart Test', null, `Using book: ${book.title}`);
      
      await addToCart(book, 1);
      
      addResult('Add to Cart Test', true, 'Successfully added to cart!');
    } catch (error) {
      addResult('Add to Cart Test', false, `Add to cart failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    try {
      setLoading(true);
      addResult('Direct API Test', null, 'Testing direct API calls...');
      
      // Test login API
      const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        addResult('Direct API Test', true, 'Direct login API successful', {
          hasUser: !!loginData.user,
          hasToken: !!loginData.token,
          tokenLength: loginData.token?.length
        });
        
        // Test cart API with token
        const cartResponse = await fetch('http://localhost:8000/api/cart', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          addResult('Direct API Test', true, 'Direct cart API successful', {
            cartItems: cartData.cart?.items?.length || 0
          });
        } else {
          const cartError = await cartResponse.json();
          addResult('Direct API Test', false, `Direct cart API failed: ${cartError.error}`);
        }
      } else {
        const loginError = await loginResponse.json();
        addResult('Direct API Test', false, `Direct login API failed: ${loginError.error}`);
      }
    } catch (error) {
      addResult('Direct API Test', false, `Direct API test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkStoredAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        addResult('Storage Check', true, 'Found stored user data', {
          email: userData.email,
          hasToken: !!userData.token,
          tokenLength: userData.token?.length
        });
        
        // Check token expiration
        if (userData.token) {
          try {
            const tokenParts = userData.token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = payload.exp - currentTime;
            
            addResult('Token Check', timeUntilExpiry > 0, 
              timeUntilExpiry > 0 ? 'Token is valid' : 'Token is expired', {
              expiresAt: new Date(payload.exp * 1000).toISOString(),
              timeUntilExpiry: `${Math.floor(timeUntilExpiry / 3600)} hours`,
              isExpired: timeUntilExpiry <= 0
            });
          } catch (tokenError) {
            addResult('Token Check', false, `Token parsing failed: ${tokenError.message}`);
          }
        }
      } catch (parseError) {
        addResult('Storage Check', false, `Failed to parse stored user: ${parseError.message}`);
      }
    } else {
      addResult('Storage Check', false, 'No stored user data found');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication & Cart Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Current State</h3>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>Cart Items:</strong> {cartItems.length}</p>
        <p><strong>Token:</strong> {user?.token ? `${user.token.substring(0, 20)}...` : 'None'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Tests</h3>
        <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
          Test Login
        </button>
        <button onClick={testAddToCart} disabled={loading} style={{ marginRight: '10px' }}>
          Test Add to Cart
        </button>
        <button onClick={testDirectAPI} disabled={loading} style={{ marginRight: '10px' }}>
          Test Direct API
        </button>
        <button onClick={checkStoredAuth} disabled={loading} style={{ marginRight: '10px' }}>
          Check Stored Auth
        </button>
        <button onClick={logout} disabled={loading} style={{ marginRight: '10px' }}>
          Logout
        </button>
        <button onClick={clearResults} disabled={loading}>
          Clear Results
        </button>
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
        <h3>Test Results</h3>
        {testResults.length === 0 ? (
          <p>No tests run yet</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ 
              marginBottom: '10px', 
              padding: '8px', 
              backgroundColor: result.success === null ? '#f0f0f0' : result.success ? '#d4edda' : '#f8d7da',
              borderRadius: '3px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 'bold' }}>
                [{result.timestamp}] {result.test}: {result.message}
              </div>
              {result.data && (
                <pre style={{ margin: '5px 0 0 0', fontSize: '11px' }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugPage;