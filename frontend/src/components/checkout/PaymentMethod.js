import React, { useState } from 'react';

const PaymentMethod = ({ onPaymentMethodChange, selectedMethod }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps like GPay, PhonePe'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Pay through your bank account'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive your order'
    }
  ];

  const handleMethodSelect = (method) => {
    onPaymentMethodChange(method);
  };

  const handleCardDetailsChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="payment-method">
      <div className="card">
        <div className="card-header">
          <h3>Payment Method</h3>
        </div>
        
        <div className="card-body">
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className={`payment-option ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="payment-radio">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    checked={selectedMethod?.id === method.id}
                    onChange={() => handleMethodSelect(method)}
                  />
                </div>
                <div className="payment-icon">{method.icon}</div>
                <div className="payment-details">
                  <div className="payment-name">{method.name}</div>
                  <div className="payment-description">{method.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Card Details Form */}
          {selectedMethod?.id === 'card' && (
            <div className="card-details-form">
              <h4>Card Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardDetailsChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength="19"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleCardDetailsChange('cardholderName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => handleCardDetailsChange('expiryDate', formatExpiryDate(e.target.value))}
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardDetailsChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {selectedMethod?.id === 'upi' && (
            <div className="upi-details">
              <h4>UPI Payment</h4>
              <p>You will be redirected to your UPI app to complete the payment.</p>
              <div className="upi-apps">
                <div className="upi-app">📱 Google Pay</div>
                <div className="upi-app">📱 PhonePe</div>
                <div className="upi-app">📱 Paytm</div>
                <div className="upi-app">📱 BHIM</div>
              </div>
            </div>
          )}

          {/* Net Banking Details */}
          {selectedMethod?.id === 'netbanking' && (
            <div className="netbanking-details">
              <h4>Net Banking</h4>
              <p>You will be redirected to your bank's website to complete the payment.</p>
              <div className="form-group">
                <label className="form-label">Select Your Bank</label>
                <select className="form-input form-select">
                  <option value="">Choose your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* COD Details */}
          {selectedMethod?.id === 'cod' && (
            <div className="cod-details">
              <h4>Cash on Delivery</h4>
              <div className="cod-info">
                <p>📦 Pay when you receive your order</p>
                <p>💵 Additional COD charges: Rs. 25</p>
                <p>⚠️ Please keep exact change ready</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;