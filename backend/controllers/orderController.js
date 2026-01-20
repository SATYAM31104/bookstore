const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, paymentStatus, subtotal, shipping, tax, codCharges, total } = req.body;
        
        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order items are required' });
        }
        
        if (!shippingAddress) {
            return res.status(400).json({ error: 'Shipping address is required' });
        }
        
        if (!paymentMethod) {
            return res.status(400).json({ error: 'Payment method is required' });
        }
        
        const order = await orderService.createOrder(req.user._id, {
            items,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentStatus || 'pending',
            subtotal: subtotal || 0,
            shipping: shipping || 0,
            tax: tax || 0,
            codCharges: codCharges || 0,
            total: total || 0
        });
        
        return res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Error in createOrder controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await orderService.getUserOrders(req.user._id);
        
        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Error in getUserOrders controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }
        
        const order = await orderService.getOrderById(req.user._id, orderId);
        
        return res.status(200).json({ order });
    } catch (error) {
        console.error('Error in getOrderById controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};