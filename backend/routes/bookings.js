const express = require('express');
const router = express.Router();
const { registerForEvent, getUserBookings } = require('../controllers/bookingController');

// GET /api/bookings/user/:userId
router.get('/user/:userId', getUserBookings);

// POST /api/bookings/register
router.post('/register', registerForEvent);

module.exports = router;