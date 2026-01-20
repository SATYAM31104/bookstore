const { generateToken } = require('../utils/jwtHelper');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async({name, email, password}) => {
    const userExists = await User.findOne({email});
    if(userExists){
        throw new Error('User already exists');
    }

    // Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with OAuth model structure
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        provider: "local",
        providerUserId: email, // Use email as unique identifier for local users
        emailVerified: true
    });

    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return { user: userResponse, token };
};

const loginUser = async ({email, password}) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid email or password');
    }

    // Check if user registered with OAuth (no password)
    if(user.provider !== "local"){
        throw new Error('Please login with your OAuth provider');
    }

    // Check if user has password
    if(!user.password){
        throw new Error('Please login with Google');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return { user: userResponse, token };
};

module.exports = {
    registerUser,
    loginUser
};