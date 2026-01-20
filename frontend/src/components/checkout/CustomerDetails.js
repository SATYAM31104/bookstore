import React, { useState, useEffect } from 'react';
import { addressesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CustomerDetails = ({ onDetailsChange, selectedAddress, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressesAPI.getAddresses(user.token);
      setAddresses(data.addresses || []);
      
      // Auto-select default address
      const defaultAddress = data.addresses?.find(addr => addr.isDefault);
      if (defaultAddress && !selectedAddress) {
        onAddressChange(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await addressesAPI.addAddress(user.token, newAddress);
      setAddresses(data.addresses || []);
      setNewAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        isDefault: false
      });
      setShowAddForm(false);
      
      // Auto-select the new address if it's the first one
      if (data.addresses?.length === 1) {
        onAddressChange(data.addresses[0]);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    console.log('Selected address:', address);
    onAddressChange(address);
  };

  return (
    <div className="customer-details">
      <div className="card">
        <div className="card-header">
          <h3>Delivery Address</h3>
        </div>
        <div className="card-body">
          {loading && addresses.length === 0 && (
            <div className="text-center">
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
              <p>Loading addresses...</p>
            </div>
          )}

          {!loading && addresses.length === 0 && !showAddForm && (
            <div className="text-center" style={{ padding: '24px 0' }}>
              <p>No delivery addresses found.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                Add New Address
              </button>
            </div>
          )}

          {addresses.length > 0 && (
            <div className="address-list">
              {addresses.map((address) => (
                <div 
                  key={address._id} 
                  className={`address-item ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="address-radio">
                    <input 
                      type="radio" 
                      name="address"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => handleAddressSelect(address)}
                    />
                  </div>
                  <div className="address-details">
                    <div className="address-name">
                      {address.name}
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </div>
                    <div className="address-text">
                      {address.street}, {address.city}, {address.state} - {address.pincode}
                    </div>
                    <div className="address-phone">Phone: {address.phone}</div>
                  </div>
                </div>
              ))}
              
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAddForm(true)}
                style={{ marginTop: '16px' }}
              >
                + Add New Address
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="add-address-form">
              <h4>Add New Address</h4>
              <form onSubmit={handleAddAddress}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    Set as default address
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Address'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;