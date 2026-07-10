const mysql = require('mysql2');
const logger = require('../middlewares/logger');


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'larren@24',
    database: process.env.DB_NAME || 'userdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

    (async () => {
        try {
            const [rows] = await promisePool.query('SELECT 1');
            logger.info('MySQL connection pool created successfully');
        } catch (error) {
            logger.error(`Database connection failed: ${error.message}`);
            process.exit(1);
        }
})();

module.exports = promisePool;