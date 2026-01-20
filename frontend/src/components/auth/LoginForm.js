import React, { useState } from 'react';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className={`form-input ${formErrors.email ? 'error' : ''}`}
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        {formErrors.email && (
          <div className="form-error">{formErrors.email}</div>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className={`form-input ${formErrors.password ? 'error' : ''}`}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
        {formErrors.password && (
          <div className="form-error">{formErrors.password}</div>
        )}
      </div>

      {/* Global Error */}
      {error && (
        <div className="form-error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner" style={{ marginRight: '8px' }}></span>
            Logging in...
          </>
        ) : (
          'LOGIN'
        )}
      </button>
    </form>
  );
};

export default LoginForm;