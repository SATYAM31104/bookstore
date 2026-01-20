const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const bookService = require('./bookService');

const createOrder = async (userId, orderData) => {
    try {
        const { items, shippingAddress, paymentMethod, paymentStatus, subtotal, shipping, tax, codCharges, total } = orderData;
        
        // Validate order items
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('Order items are required');
        }
        
        // Create order with the provided data
        const order = await Order.create({
            userId,
            items: items.map(item => ({
                bookId: item.bookId,
                title: item.title,
                author: item.author,
                price: item.price,
                quantity: item.quantity,
                thumbnail: item.thumbnail
            })),
            shippingAddress: {
                name: shippingAddress.name,
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                phone: shippingAddress.phone
            },
            paymentMethod,
            paymentStatus,
            subtotal,
            shipping,
            tax,
            codCharges,
            totalAmount: total,
            orderStatus: 'confirmed',
            status: 'confirmed' // Add status field for frontend compatibility
        });
        
        console.log(`Order created successfully for user: ${userId}, Order ID: ${order._id}`);
        
        return order;
    } catch (error) {
        console.error('Error in createOrder:', error);
        throw new Error(error.message || 'Failed to create order');
    }
};

const getUserOrders = async (userId) => {
    try {
        console.log(`Fetching orders for user: ${userId}`);
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders for user: ${userId}`);
        
        // Ensure both status fields are available for frontend compatibility
        const ordersWithStatus = orders.map(order => ({
            ...order.toObject(),
            status: order.status || order.orderStatus,
            total: order.totalAmount || order.total
        }));
        
        return ordersWithStatus;
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        throw new Error('Failed to get orders');
    }
};

const getOrderById = async (userId, orderId) => {
    try {
        const order = await Order.findOne({ _id: orderId, userId });
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        return order;
    } catch (error) {
        console.error('Error in getOrderById:', error);
        throw new Error('Failed to get order');
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};