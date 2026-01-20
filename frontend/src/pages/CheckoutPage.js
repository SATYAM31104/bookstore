import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';
import CustomerDetails from '../components/checkout/CustomerDetails';
import PaymentMethod from '../components/checkout/PaymentMethod';
import OrderSummary from '../components/checkout/OrderSummary';

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const { cartItems, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: '/checkout' }
  ];

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const codCharges = selectedPaymentMethod?.id === 'cod' ? 25 : 0;
  const total = subtotal + shipping + tax + codCharges;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Validate card details if card payment is selected
    if (selectedPaymentMethod.id === 'card') {
      const cardForm = document.querySelector('.card-details-form');
      if (cardForm) {
        const cardNumber = cardForm.querySelector('input[placeholder*="1234"]').value;
        const cardholderName = cardForm.querySelector('input[placeholder*="John"]').value;
        const expiryDate = cardForm.querySelector('input[placeholder*="MM/YY"]').value;
        const cvv = cardForm.querySelector('input[placeholder*="123"]').value;

        if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
          alert('Please fill in all card details');
          return;
        }

        // Basic validation
        if (cardNumber.replace(/\s/g, '').length < 16) {
          alert('Please enter a valid card number');
          return;
        }

        if (cvv.length < 3) {
          alert('Please enter a valid CVV');
          return;
        }

        // Validate expiry date
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          alert('Please enter a valid expiry month (01-12)');
          return;
        }
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          alert('Card has expired. Please use a valid card.');
          return;
        }
      }
    }

    // Validate UPI details
    if (selectedPaymentMethod.id === 'upi') {
      // For demo purposes, we'll just show a confirmation
      const confirmUPI = window.confirm('You will be redirected to your UPI app. Continue?');
      if (!confirmUPI) {
        return;
      }
    }

    // Validate Net Banking details
    if (selectedPaymentMethod.id === 'netbanking') {
      const bankSelect = document.querySelector('.netbanking-details select');
      if (bankSelect && !bankSelect.value) {
        alert('Please select your bank');
        return;
      }
      
      const confirmNetBanking = window.confirm('You will be redirected to your bank\'s website. Continue?');
      if (!confirmNetBanking) {
        return;
      }
    }

    try {
      setLoading(true);

      // Simulate payment processing
      if (selectedPaymentMethod.id !== 'cod') {
        // Show payment processing message
        const paymentMessages = {
          card: 'Processing card payment...',
          upi: 'Connecting to UPI app...',
          netbanking: 'Redirecting to bank website...'
        };
        
        console.log(paymentMessages[selectedPaymentMethod.id]);
        
        // Simulate payment processing delay with progress
        await new Promise(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            console.log(`Payment processing: ${progress}%`);
            
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 400);
        });

        // Enhanced payment success/failure logic (85% success rate)
        const paymentSuccess = Math.random() > 0.15;
        
        if (!paymentSuccess) {
          const errorMessages = {
            card: 'Card payment failed. Please check your card details or try a different card.',
            upi: 'UPI payment failed. Please try again or use a different payment method.',
            netbanking: 'Net banking payment failed. Please try again or use a different payment method.'
          };
          throw new Error(errorMessages[selectedPaymentMethod.id]);
        }
        
        console.log('Payment successful!');
      }

      // Prepare order data with proper address structure
      const orderData = {
        items: cartItems.map(item => ({
          bookId: item.bookId,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        shippingAddress: {
          name: selectedAddress.name,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          phone: selectedAddress.phone
        },
        paymentMethod: selectedPaymentMethod.id,
        paymentStatus: selectedPaymentMethod.id === 'cod' ? 'pending' : 'completed',
        subtotal,
        shipping,
        tax,
        codCharges,
        total
      };

      console.log('Creating order with data:', orderData);
      const response = await ordersAPI.createOrder(user.token, orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      setOrderId(response.order._id);
      setOrderPlaced(true);
      
      console.log('Order placed successfully:', response.order._id);
      
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (errorMessage.includes('400')) {
        errorMessage = 'Invalid order data. Please check your details and try again.';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      alert(`❌ Order Failed!\n\n${errorMessage}\n\nPlease try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="App">
        <Header user={user} cartItemCount={0} />
        <main className="main-content">
          <div className="container">
            <div className="text-center" style={{ padding: '48px 0' }}>
              <h3>Your cart is empty</h3>
              <p>Add some books to your cart before checkout.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Order success page
  if (orderPlaced) {
    return (
      <div className="App">
        <Header user={user} cartItemCount={0} />
        <main className="main-content">
          <div className="container">
            <div className="order-success">
              <div className="text-center" style={{ padding: '48px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your order. Your order ID is: <strong>{orderId}</strong></p>
                <p>You will receive a confirmation email shortly.</p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/orders')}
                  >
                    View Orders
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} cartItemCount={getCartItemCount()} />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="main-content">
        <div className="container">
          <div className="checkout-page">
            <h1>Checkout</h1>
            
            <div className="checkout-content">
              <div className="checkout-main">
                <CustomerDetails 
                  selectedAddress={selectedAddress}
                  onAddressChange={setSelectedAddress}
                />
                
                <PaymentMethod 
                  selectedMethod={selectedPaymentMethod}
                  onPaymentMethodChange={setSelectedPaymentMethod}
                />
              </div>
              
              <div className="checkout-sidebar">
                <OrderSummary 
                  selectedAddress={selectedAddress} 
                  selectedPaymentMethod={selectedPaymentMethod}
                />
                
                <div className="checkout-actions">
                  <button 
                    className="btn btn-primary btn-block btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedAddress || !selectedPaymentMethod}
                  >
                    {loading ? 'Placing Order...' : `Place Order - Rs. ${total}`}
                  </button>
                  
                  <button 
                    className="btn btn-ghost btn-block"
                    onClick={() => navigate('/cart')}
                    disabled={loading}
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;