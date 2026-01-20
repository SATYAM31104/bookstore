import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addressesAPI } from '../services/api';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });

  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'My Profile', path: '/profile' }
  ];

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressesAPI.getAddresses(user.token);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingAddress) {
        await addressesAPI.updateAddress(user.token, editingAddress._id, addressForm);
      } else {
        await addressesAPI.addAddress(user.token, addressForm);
      }
      
      await fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setLoading(true);
        await addressesAPI.deleteAddress(user.token, addressId);
        await fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      await addressesAPI.setDefaultAddress(user.token, addressId);
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="App">
      <Header user={user} cartItemCount={getCartItemCount()} />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="main-content">
        <div className="container">
          <div className="profile-page">
            <h1>My Profile</h1>
            
            <div className="profile-content">
              {/* Sidebar */}
              <div className="profile-sidebar">
                <div className="profile-nav">
                  <button 
                    className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    👤 Profile Information
                  </button>
                  <button 
                    className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    📍 Manage Addresses
                  </button>
                  <button 
                    className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => window.location.href = '/orders'}
                  >
                    📦 My Orders
                  </button>
                  <button 
                    className="profile-nav-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="profile-main">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div className="profile-info">
                    <div className="card">
                      <div className="card-header">
                        <h3>Profile Information</h3>
                      </div>
                      <div className="card-body">
                        <div className="profile-details">
                          <div className="profile-field">
                            <label>Name</label>
                            <div className="profile-value">{user.name}</div>
                          </div>
                          <div className="profile-field">
                            <label>Email</label>
                            <div className="profile-value">{user.email}</div>
                          </div>
                          <div className="profile-field">
                            <label>Member Since</label>
                            <div className="profile-value">
                              {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long'
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ marginTop: '24px' }}>
                          <button className="btn btn-primary">
                            Edit Profile
                          </button>
                          <button className="btn btn-outline" style={{ marginLeft: '12px' }}>
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="addresses-section">
                    <div className="addresses-header">
                      <h3>Manage Addresses</h3>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setShowAddressForm(true);
                          setEditingAddress(null);
                          setAddressForm({
                            name: '',
                            street: '',
                            city: '',
                            state: '',
                            pincode: '',
                            phone: '',
                            isDefault: false
                          });
                        }}
                      >
                        + Add New Address
                      </button>
                    </div>
                    
                    {/* Address Form */}
                    {showAddressForm && (
                      <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                          <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                        </div>
                        <div className="card-body">
                          <form onSubmit={handleAddressSubmit}>
                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={addressForm.name}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                  type="tel"
                                  className="form-input"
                                  value={addressForm.phone}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Street Address</label>
                              <input
                                type="text"
                                className="form-input"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                                required
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Pincode</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={addressForm.pincode}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-checkbox">
                                <input
                                  type="checkbox"
                                  checked={addressForm.isDefault}
                                  onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
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
                                {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-ghost"
                                onClick={() => {
                                  setShowAddressForm(false);
                                  setEditingAddress(null);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    
                    {/* Addresses List */}
                    {loading && addresses.length === 0 ? (
                      <div className="text-center" style={{ padding: '24px 0' }}>
                        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
                        <p>Loading addresses...</p>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center" style={{ padding: '48px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                        <h3>No addresses found</h3>
                        <p>Add your first address to get started.</p>
                      </div>
                    ) : (
                      <div className="addresses-list">
                        {addresses.map((address) => (
                          <div key={address._id} className="address-card">
                            <div className="address-header">
                              <div className="address-name">
                                {address.name}
                                {address.isDefault && <span className="default-badge">Default</span>}
                              </div>
                              <div className="address-actions">
                                <button 
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  Edit
                                </button>
                                {!address.isDefault && (
                                  <button 
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleSetDefaultAddress(address._id)}
                                    disabled={loading}
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button 
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => handleDeleteAddress(address._id)}
                                  disabled={loading}
                                  style={{ color: 'var(--error-red)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="address-details">
                              <div>{address.street}</div>
                              <div>{address.city}, {address.state} - {address.pincode}</div>
                              <div>Phone: {address.phone}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;