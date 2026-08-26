const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

// PUT /api/auth/profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;