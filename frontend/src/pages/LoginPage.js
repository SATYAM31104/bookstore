import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt:', formData);
      
      // Use real authentication
      await login(formData);
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signup attempt:', formData);
      
      // Use real authentication
      await signup(formData);
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // TODO: Implement social login
    setError(`${provider} login not implemented yet`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Illustration */}
        <div className="login-illustration">
          <div style={{ 
            width: '250px', 
            height: '250px', 
            backgroundColor: '#4A90E2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Person in Shopping Cart Illustration */}
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Person */}
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '50px',
                zIndex: 2
              }}>
                {/* Head */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#FFB6A3',
                  borderRadius: '50%',
                  marginBottom: '5px',
                  position: 'relative'
                }}>
                  {/* Hair */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '5px',
                    width: '30px',
                    height: '25px',
                    backgroundColor: '#2C3E50',
                    borderRadius: '15px 15px 0 0'
                  }}></div>
                </div>
                
                {/* Body */}
                <div style={{
                  width: '50px',
                  height: '60px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '25px 25px 10px 10px',
                  position: 'relative'
                }}>
                  {/* Arms */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '-15px',
                    width: '25px',
                    height: '8px',
                    backgroundColor: '#FFB6A3',
                    borderRadius: '4px',
                    transform: 'rotate(-20deg)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '-10px',
                    width: '20px',
                    height: '8px',
                    backgroundColor: '#FFB6A3',
                    borderRadius: '4px'
                  }}>
                    {/* Phone */}
                    <div style={{
                      position: 'absolute',
                      left: '-8px',
                      top: '-2px',
                      width: '12px',
                      height: '8px',
                      backgroundColor: '#2C3E50',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
                
                {/* Legs */}
                <div style={{
                  display: 'flex',
                  gap: '5px',
                  marginTop: '5px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '40px',
                    backgroundColor: '#8E44AD',
                    borderRadius: '10px'
                  }}>
                    {/* Shoe */}
                    <div style={{
                      marginTop: '35px',
                      width: '25px',
                      height: '8px',
                      backgroundColor: '#8E44AD',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '40px',
                    backgroundColor: '#8E44AD',
                    borderRadius: '10px'
                  }}>
                    {/* Shoe */}
                    <div style={{
                      marginTop: '35px',
                      width: '25px',
                      height: '8px',
                      backgroundColor: '#8E44AD',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Shopping Cart */}
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '20px',
                zIndex: 1
              }}>
                {/* Cart Body */}
                <div style={{
                  width: '80px',
                  height: '50px',
                  border: '3px solid #FFFFFF',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  position: 'relative'
                }}>
                  {/* Cart Grid */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '8px',
                    bottom: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '3px'
                  }}>
                    {Array.from({length: 6}).map((_, i) => (
                      <div key={i} style={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '2px'
                      }}></div>
                    ))}
                  </div>
                </div>
                
                {/* Cart Handle */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-10px',
                  width: '25px',
                  height: '20px',
                  border: '3px solid #FFFFFF',
                  borderBottom: 'none',
                  borderRadius: '12px 12px 0 0'
                }}></div>
                
                {/* Cart Wheels */}
                <div style={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '10px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-15px',
                  right: '15px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
          </div>
          <h3 style={{ color: '#2196F3', marginBottom: '8px', fontSize: '18px' }}>ONLINE BOOK SHOPPING</h3>
          <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', fontSize: '14px' }}>
            Discover thousands of books from your favorite authors and explore new worlds of knowledge.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-container">
          {/* Tabs */}
          <div className="login-tabs">
            <button 
              className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
            >
              LOGIN
            </button>
            <button 
              className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
            >
              SIGNUP
            </button>
          </div>

          {/* Form Content */}
          <div style={{ marginBottom: '24px' }}>
            {activeTab === 'login' ? (
              <LoginForm 
                onSubmit={handleLogin}
                loading={loading}
                error={error}
              />
            ) : (
              <SignupForm 
                onSubmit={handleSignup}
                loading={loading}
                error={error}
              />
            )}
          </div>

          {/* Divider */}
          <div style={{ 
            textAlign: 'center', 
            margin: '24px 0',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#E0E0E0'
            }}></div>
            <span style={{
              backgroundColor: 'white',
              padding: '0 16px',
              color: '#666',
              position: 'relative'
            }}>
              OR
            </span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button 
              className="social-btn"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={loading}
            >
              <span style={{ color: '#1877F2' }}>📘</span>
              Facebook
            </button>
            <button 
              className="social-btn"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
            >
              <span style={{ color: '#DB4437' }}>🔍</span>
              Google
            </button>
          </div>

          {/* Additional Links */}
          {activeTab === 'login' && (
            <div className="text-center" style={{ marginTop: '16px' }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: 'var(--secondary-blue)',
                  fontSize: '14px'
                }}
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center" style={{ marginTop: '24px' }}>
            <Link 
              to="/" 
              style={{ 
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;