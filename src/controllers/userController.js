const userService = require('../services/userService');
const logger = require('../middlewares/logger');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            // Basic validation
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            const result = await userService.register(name, email, password);
            res.status(201).json(result);
        } catch (error) {
            logger.error(`Registration controller error: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await userService.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Login controller error: ${error.message}`);
            res.status(401).json({ error: error.message });
        }
    }

    async profile(req, res) {
        try {
            const user = await userService.getProfile(req.user.sub);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            logger.error(`Profile controller error: ${error.message}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();