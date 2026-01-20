const addressService = require('../services/addressService');

const addAddress = async (req, res) => {
    try {
        const { name, street, city, state, pincode, phone, isDefault } = req.body;
        
        // Validate required fields
        if (!name || !street || !city || !state || !pincode || !phone) {
            return res.status(400).json({ 
                error: 'All fields are required: name, street, city, state, pincode, phone' 
            });
        }
        
        const address = await addressService.addAddress(req.user._id, {
            name, street, city, state, pincode, phone, isDefault
        });
        
        // Return all addresses after adding
        const addresses = await addressService.getAddresses(req.user._id);
        
        return res.status(201).json({
            message: 'Address added successfully',
            address,
            addresses
        });
    } catch (error) {
        console.error('Error in addAddress controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await addressService.getAddresses(req.user._id);
        return res.status(200).json({ addresses });
    } catch (error) {
        console.error('Error in getAddresses controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const updateData = req.body;
        
        if (!addressId) {
            return res.status(400).json({ error: 'Address ID is required' });
        }
        
        const address = await addressService.updateAddress(req.user._id, addressId, updateData);
        
        // Return all addresses after updating
        const addresses = await addressService.getAddresses(req.user._id);
        
        return res.status(200).json({
            message: 'Address updated successfully',
            address,
            addresses
        });
    } catch (error) {
        console.error('Error in updateAddress controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        
        if (!addressId) {
            return res.status(400).json({ error: 'Address ID is required' });
        }
        
        const result = await addressService.deleteAddress(req.user._id, addressId);
        
        // Return all addresses after deleting
        const addresses = await addressService.getAddresses(req.user._id);
        
        return res.status(200).json({
            ...result,
            addresses
        });
    } catch (error) {
        console.error('Error in deleteAddress controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        
        if (!addressId) {
            return res.status(400).json({ error: 'Address ID is required' });
        }
        
        const address = await addressService.setDefaultAddress(req.user._id, addressId);
        
        // Return all addresses after setting default
        const addresses = await addressService.getAddresses(req.user._id);
        
        return res.status(200).json({
            message: 'Default address set successfully',
            address,
            addresses
        });
    } catch (error) {
        console.error('Error in setDefaultAddress controller:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};