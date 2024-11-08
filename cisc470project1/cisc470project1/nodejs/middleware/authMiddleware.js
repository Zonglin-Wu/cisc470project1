// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and has a Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.redirect('/auth/login'); // Redirect to login if no token is found
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.user_id; // Add user ID from token to request for use in controllers
        next(); // Proceed if token is valid
    } catch (error) {
        // Redirect to login if token verification fails
        return res.redirect('/auth/login');
    }
};

module.exports = authMiddleware;
