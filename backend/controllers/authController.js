const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        
        const result = await authService.registerUser({name, email, password});
        const {user, token} = result;
        res.status(201).json({user, token});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        
        const result = await authService.loginUser({email, password});
        const {user, token} = result;
        res.status(200).json({user, token});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
};

module.exports = {
    register,
    login
};