const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { verifyFirebaseToken, requireCampusUser } = require('../middleware/auth');

// POST /api/auth/sync (creates or links user via Firebase token)
router.post('/sync', verifyFirebaseToken, syncUser);

// GET /api/auth/profile (protected route)
router.get('/profile', verifyFirebaseToken, requireCampusUser, getUserProfile);

// PUT /api/auth/profile
router.put('/profile', verifyFirebaseToken, requireCampusUser, updateUserProfile);

module.exports = router;