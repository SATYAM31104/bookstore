import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = ({ onSubmit, loading = false, error = null, success = false }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Email is invalid';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validateEmail();
    if (error) {
      setEmailError(error);
      return;
    }
    
    onSubmit({ email });
  };

  if (success) {
    return (
      <div className="text-center">
        <div style={{ 
          backgroundColor: 'var(--success-green)', 
          color: 'white', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Email Sent!</h3>
          <p style={{ margin: 0 }}>
            We've sent a password reset link to your email address.
          </p>
        </div>
        
        <Link to="/login" className="btn btn-primary">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '32px' }}>
        <h2>Forgot Your Password?</h2>
        <p className="text-secondary">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className={`form-input ${emailError ? 'error' : ''}`}
            placeholder="Enter your email address"
            value={email}
            onChange={handleChange}
            disabled={loading}
          />
          {emailError && (
            <div className="form-error">{emailError}</div>
          )}
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading}
          style={{ marginBottom: '16px' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
              Sending...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <div className="text-center">
          <Link to="/login" className="btn btn-secondary">
            CREATE ACCOUNT
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;