import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Check if token exists and is not expired
          if (userData.token) {
            // Decode JWT to check expiration (basic check)
            try {
              const tokenParts = userData.token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                // Add 5 minute buffer to prevent premature expiration
                const bufferTime = 5 * 60; // 5 minutes in seconds
                
                // If token is expired (with buffer), remove it
                if (payload.exp && (payload.exp - bufferTime) < currentTime) {
                  console.log('Token expired or expiring soon, removing user data');
                  localStorage.removeItem('user');
                  setUser(null);
                  setLoading(false);
                  return;
                }
                
                console.log('Token valid, expires at:', new Date(payload.exp * 1000));
              }
            } catch (tokenError) {
              console.error('Error parsing token:', tokenError);
              localStorage.removeItem('user');
              setUser(null);
              setLoading(false);
              return;
            }
          }
          
          setUser(userData);
          console.log('User authenticated:', userData.email);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const data = await authAPI.login(credentials);
      
      // Validate response data
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      // Store user data
      const userData = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('Login successful for:', userData.email);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear any existing user data on login failure
      localStorage.removeItem('user');
      setUser(null);
      
      // Provide more specific error messages
      if (error.message.includes('401') || error.message.includes('Invalid email or password')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.message.includes('400')) {
        throw new Error('Please fill in all required fields.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      // Auto-login after successful signup
      return await login({ email: userData.email, password: userData.password });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    console.log('User logged out');
  };

  // Function to handle authentication errors (token expiration, etc.)
  const handleAuthError = () => {
    console.log('Authentication error detected, logging out user');
    logout();
  };

  const forgotPassword = async (email) => {
    try {
      return await authAPI.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    handleAuthError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;