const express = require('express');
const { 
    addAddress, 
    getAddresses, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// All address routes require authentication
router.use(authMiddleware);

// Address routes
router.post('/', addAddress);                           // POST /api/addresses
router.get('/', getAddresses);                          // GET /api/addresses
router.put('/:addressId', updateAddress);               // PUT /api/addresses/123
router.delete('/:addressId', deleteAddress);           // DELETE /api/addresses/123
router.patch('/:addressId/default', setDefaultAddress); // PATCH /api/addresses/123/default

module.exports = router;