// Simple test script to verify all endpoints
// Run with: node test_endpoints.js

const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';
let authToken = '';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
};

const testAddress = {
    name: 'Test Address',
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    pincode: '12345',
    phone: '1234567890',
    isDefault: true
};

async function runTests() {
    try {
        console.log('🚀 Starting API Tests...\n');

        // 1. Test Health Check
        console.log('1. Testing Health Check...');
        const health = await axios.get(`${BASE_URL.replace('/api', '')}/`);
        console.log('✅ Health Check:', health.data);

        // 2. Test User Registration
        console.log('\n2. Testing User Registration...');
        try {
            const register = await axios.post(`${BASE_URL}/auth/register`, testUser);
            console.log('✅ Registration successful');
        } catch (error) {
            if (error.response?.data?.error?.includes('duplicate')) {
                console.log('ℹ️  User already exists, continuing...');
            } else {
                throw error;
            }
        }

        // 3. Test User Login
        console.log('\n3. Testing User Login...');
        const login = await axios.post(`${BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = login.data.token;
        console.log('✅ Login successful, token received');

        // Set auth header for subsequent requests
        const authHeaders = { Authorization: `Bearer ${authToken}` };

        // 4. Test Books API
        console.log('\n4. Testing Books API...');
        const books = await axios.get(`${BASE_URL}/books`);
        console.log(`✅ Books fetched: ${books.data.books.length} books`);

        const searchBooks = await axios.get(`${BASE_URL}/books/search?q=javascript`);
        console.log(`✅ Book search: ${searchBooks.data.books.length} results`);

        // Get a book ID for testing
        const testBookId = books.data.books[0]?.googleBookId;
        if (!testBookId) {
            throw new Error('No books available for testing');
        }

        // 5. Test Cart API
        console.log('\n5. Testing Cart API...');
        await axios.post(`${BASE_URL}/cart/add`, {
            bookId: testBookId,
            quantity: 2
        }, { headers: authHeaders });
        console.log('✅ Item added to cart');

        const cart = await axios.get(`${BASE_URL}/cart`, { headers: authHeaders });
        console.log(`✅ Cart retrieved: ${cart.data.cart.items.length} items`);

        // 6. Test Address API
        console.log('\n6. Testing Address API...');
        const addAddress = await axios.post(`${BASE_URL}/addresses`, testAddress, { headers: authHeaders });
        const addressId = addAddress.data.address._id;
        console.log('✅ Address added');

        const addresses = await axios.get(`${BASE_URL}/addresses`, { headers: authHeaders });
        console.log(`✅ Addresses retrieved: ${addresses.data.addresses.length} addresses`);

        // 7. Test Review API
        console.log('\n7. Testing Review API...');
        await axios.post(`${BASE_URL}/reviews`, {
            bookId: testBookId,
            rating: 5,
            comment: 'Great book for testing!'
        }, { headers: authHeaders });
        console.log('✅ Review added');

        const reviews = await axios.get(`${BASE_URL}/reviews/book/${testBookId}`);
        console.log(`✅ Reviews retrieved: ${reviews.data.reviews.length} reviews`);

        // 8. Test Order API
        console.log('\n8. Testing Order API...');
        const order = await axios.post(`${BASE_URL}/orders`, {
            addressId: addressId
        }, { headers: authHeaders });
        console.log('✅ Order created successfully');

        const orders = await axios.get(`${BASE_URL}/orders`, { headers: authHeaders });
        console.log(`✅ Orders retrieved: ${orders.data.orders.length} orders`);

        console.log('\n🎉 All tests passed! Backend is fully functional.');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Run tests if server is running
runTests();