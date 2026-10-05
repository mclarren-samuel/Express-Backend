const { pool: db } = require('../config/database');
const logger = require('../middlewares/logger');


class UserRepository {
    async createUser({ name, email, hashedPassword }) {
        const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [name, email, hashedPassword]);
        logger.info(`User created with ID: ${result.insertId}`);
        return result.insertId;
    }

    async findUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }

    async findUserById(id) {
        const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
}

module.exports = new UserRepository();