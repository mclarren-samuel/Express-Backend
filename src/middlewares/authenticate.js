const jwt = require('jsonwebtoken');

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return secret;
}

function authenticate(req, res, next) {
    const authorization = req.get('authorization');
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        req.user = jwt.verify(token, getJwtSecret());
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { getJwtSecret, authenticate };