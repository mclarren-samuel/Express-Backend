const db = require('../config/database');
const logger = require('../middlewares/logger');


class UserRepository {
    async createUser({ name, email, hashedPassword }) {
        const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)_';
        const [result] = await db.execute(sql, [name, email, hashedPassword]);
        logger.info(`User created with ID: ${result.insertId}`);
        return result.insertId;
    }

    async findUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = new UserRepository();