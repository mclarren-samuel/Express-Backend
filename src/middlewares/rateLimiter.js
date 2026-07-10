const rateLimit = require('express-rate-limit');

// Block brute-force attacks: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
});

// Stricter limiter for login (prevent password brute-force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Only 10 login attempts per 15 min
    message: 'Too many login attempts, please try again after 15 minutes',
});

module.exports = { limiter, loginLimiter };