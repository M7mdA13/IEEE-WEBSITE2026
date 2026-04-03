const router = require('express').Router();
const auth = require('../../middleware/auth');
const { login, logout, register, me } = require('../../controllers/auth.controller');

// Public — no auth guard
router.post('/login', login);

// Protected — require valid JWT
router.post('/logout', auth, logout);
router.post('/register', auth, register);
router.get('/me', auth, me);

module.exports = router;
