const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const logger = require('../middlewares/logger');

class UserService {
    async register(name, email, password) {
        // Check if user already exists
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            logger.warn(`Registration failed: Email ${email} already exists`);
            throw new Error('User already exists');
        }

        // Hash password (salt = 10 rounds - industry standard)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userId = await userRepository.createUser({ name, email, hashedPassword });
        logger.info(`New user registered: ${email}`);
        return { userId, message: 'Registration successful' };
    }

    async login(email, password) {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            logger.warn(`Login failed: No user with email ${email}`);
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            logger.warn(`Login failed: Incorrect password for ${email}`);
            throw new Error('Invalid credentials');
        }

        logger.info(`User logged in: ${email}`);
        return { userId: user.id, name: user.name, message: 'Login successful' };
    }
}

module.exports = new UserService();