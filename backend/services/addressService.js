const Address = require('../models/Address');

const addAddress = async (userId, addressData) => {
    try {
        const { name, street, city, state, pincode, phone, isDefault = false } = addressData;
        
        // If this is set as default, remove default from other addresses
        if (isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { isDefault: false }
            );
        }
        
        const address = await Address.create({
            userId,
            name,
            street,
            city,
            state,
            pincode,
            phone,
            isDefault
        });
        
        return address;
    } catch (error) {
        console.error('Error in addAddress:', error);
        throw new Error('Failed to add address');
    }
};

const getAddresses = async (userId) => {
    try {
        const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        return addresses;
    } catch (error) {
        console.error('Error in getAddresses:', error);
        throw new Error('Failed to get addresses');
    }
};

const updateAddress = async (userId, addressId, updateData) => {
    try {
        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            throw new Error('Address not found');
        }
        
        // If setting as default, remove default from other addresses
        if (updateData.isDefault === true) {
            await Address.updateMany(
                { userId, _id: { $ne: addressId }, isDefault: true },
                { isDefault: false }
            );
        }
        
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            updateData,
            { new: true, runValidators: true }
        );
        
        return updatedAddress;
    } catch (error) {
        console.error('Error in updateAddress:', error);
        throw new Error('Failed to update address');
    }
};

const deleteAddress = async (userId, addressId) => {
    try {
        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            throw new Error('Address not found');
        }
        
        await Address.findByIdAndDelete(addressId);
        
        // If deleted address was default, make the first remaining address default
        if (address.isDefault) {
            const firstAddress = await Address.findOne({ userId }).sort({ createdAt: 1 });
            if (firstAddress) {
                firstAddress.isDefault = true;
                await firstAddress.save();
            }
        }
        
        return { message: 'Address deleted successfully' };
    } catch (error) {
        console.error('Error in deleteAddress:', error);
        throw new Error('Failed to delete address');
    }
};

const setDefaultAddress = async (userId, addressId) => {
    try {
        const address = await Address.findOne({ _id: addressId, userId });
        
        if (!address) {
            throw new Error('Address not found');
        }
        
        // Remove default from all addresses for this user
        await Address.updateMany(
            { userId, isDefault: true },
            { isDefault: false }
        );
        
        // Set this address as default
        address.isDefault = true;
        await address.save();
        
        return address;
    } catch (error) {
        console.error('Error in setDefaultAddress:', error);
        throw new Error('Failed to set default address');
    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};