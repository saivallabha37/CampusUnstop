const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

const registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check registration deadline
    if (new Date() >= event.registrationDeadline) {
      return res.status(400).json({
        message: 'Registration deadline has passed'
      });
    }

    // Check capacity
    if (event.attendees >= event.capacity) {
      return res.status(400).json({
        message: 'Event is full'
      });
    }

    // Find registering user
    const registeringUser = await User.findById(userId);

    if (!registeringUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Find event organizer
    const organizer = await User.findById(event.organizerId);

    // Create booking
    const booking = new Booking({
      userId,
      eventId
    });

    await booking.save();

    // Update event
    event.attendees += 1;
    event.participants.push(userId);

    await event.save();

    // Send notification to registering user
    await sendNotification({
      type: 'EVENT_REGISTERED',

      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        category: event.category
      },

      registeredUser: {
        id: registeringUser._id,
        name: registeringUser.name,
        email: registeringUser.email
      },

      organizer: organizer
        ? {
            id: organizer._id,
            name: organizer.name,
            email: organizer.email
          }
        : null
    });

    res.status(201).json({
      message: 'Registration successful',
      booking
    });

  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.userId
    }).populate('eventId');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  registerForEvent,
  getUserBookings
};
