const express = require('express');
const helmet = require('helmet');
const { limiter, loginLimiter } = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');
const userController = require('./controllers/userController');
const { authenticate } = require('./middlewares/authenticate');

const app = express();

// 1. Helmet - hides technology stack (security)
app.use(helmet());

// 2. Global rate limiter - prevents DoS attacks
app.use(limiter);

// 3. Parse JSON bodies
app.use(express.json());

// 4. Custom logging middleware (logs every request)
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// 5. Routes
app.post('/api/register', userController.register);
app.post('/api/login', loginLimiter, userController.login); // Extra protection for login
app.get('/api/me', authenticate, userController.profile);

// 6. Health check (for Docker/Kubernetes)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 7. Global error handler (industry standard)
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.stack}`);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;