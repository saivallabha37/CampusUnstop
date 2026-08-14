const Event = require('../models/Event');
const Booking = require('../models/Booking');

const registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Rule 1: Check if new Date() < registrationDeadline
    if (new Date() >= event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Rule 2: Check if attendees < capacity
    if (event.attendees >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Create booking
    const booking = new Booking({ userId, eventId });
    await booking.save();

    // Increment attendees
    event.attendees += 1;
    event.participants.push(userId);
    await event.save();

    res.status(201).json({ message: 'Registration successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('eventId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerForEvent,
  getUserBookings
};