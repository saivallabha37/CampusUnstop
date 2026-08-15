const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  getEventsByOrganizer,
  searchEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// GET /api/events
router.get('/', getAllEvents);

// GET /api/events/search
router.get('/search', searchEvents);

// GET /api/events/organizer/:organizerId
router.get('/organizer/:organizerId', getEventsByOrganizer);

// GET /api/events/:id
router.get('/:id', getEventById);

// POST /api/events
router.post('/', createEvent);

// PUT /api/events/:id
router.put('/:id', updateEvent);

// DELETE /api/events/:id
router.delete('/:id', deleteEvent);

module.exports = router;