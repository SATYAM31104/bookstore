import React, { useState } from 'react';
import Header from '../components/common/Header';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      console.log('Password reset request:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div style={{ 
            maxWidth: '500px', 
            margin: '48px auto',
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
          }}>
            <ForgotPasswordForm 
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              success={success}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;