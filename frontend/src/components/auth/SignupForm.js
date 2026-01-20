import React, { useState } from 'react';

const SignupForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="name"
          className={`form-input ${formErrors.name ? 'error' : ''}`}
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        {formErrors.name && (
          <div className="form-error">{formErrors.name}</div>
        )}
      </div>

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

      {/* Confirm Password Field */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
        />
        {formErrors.confirmPassword && (
          <div className="form-error">{formErrors.confirmPassword}</div>
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
            Creating Account...
          </>
        ) : (
          'SIGN UP'
        )}
      </button>
    </form>
  );
};

export default SignupForm;