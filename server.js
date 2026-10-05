require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/middlewares/logger');
const { pool, checkDatabaseConnection } = require('./src/config/database');
const { getJwtSecret } = require('./src/middlewares/authenticate');

const PORT = process.env.PORT || 3000;

let server;

async function start() {
    getJwtSecret();
    await checkDatabaseConnection();
    server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

async function shutdown(signal) {
    logger.info(`${signal} received, closing server...`);
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
    await pool.end();
    logger.info('Server closed');
}

process.on('SIGTERM', () => {
    shutdown('SIGTERM').finally(() => process.exit(0));
});

process.on('SIGINT', () => {
    shutdown('SIGINT').finally(() => process.exit(0));
});

start().catch((error) => {
    logger.error(`Application startup failed: ${error.message}`);
    process.exit(1);
});