const mysql = require('mysql2');
const logger = require('../middlewares/logger');


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'userdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

async function checkDatabaseConnection() {
    try {
        await promisePool.query('SELECT 1');
        logger.info('MySQL connection pool created successfully');
    } catch (error) {
        logger.error(`Database connection failed: ${error.message}`);
        throw error;
    }
}

module.exports = { pool: promisePool, checkDatabaseConnection };