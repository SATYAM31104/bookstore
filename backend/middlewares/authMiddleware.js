const { verifyToken } = require("../utils/jwtHelper");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access token required" });
        }

        const token = authHeader.split(" ")[1];
        
        // Check if token exists and is not empty
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ error: "Invalid access token" });
        }

        // Verify token now 
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user; // attach user to req.user
        req.userId = user._id;
        next();
    }
    catch (error) {
        // Provide specific error messages for different JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid access token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access token has expired. Please login again." });
        } else if (error.name === 'NotBeforeError') {
            return res.status(401).json({ error: "Access token not active yet" });
        } else {
            console.error("Auth middleware error:", error);
            return res.status(401).json({ error: "Authentication failed" });
        }
    }
}

module.exports = authMiddleware