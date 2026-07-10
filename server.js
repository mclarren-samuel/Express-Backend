require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/middlewares/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown (industry standard)
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});