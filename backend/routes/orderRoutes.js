const express = require('express');
const { 
    createOrder, 
    getUserOrders, 
    getOrderById 
} = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// Order routes
router.post('/', createOrder);                    // POST /api/orders
router.get('/', getUserOrders);                   // GET /api/orders
router.get('/:orderId', getOrderById);           // GET /api/orders/123

module.exports = router;