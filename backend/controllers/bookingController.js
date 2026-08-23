const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

const registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // --------------------------------------------------
    // 1. Find event
    // --------------------------------------------------
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // --------------------------------------------------
    // 2. Find registering user
    // --------------------------------------------------
    const registeringUser = await User.findById(userId);

    if (!registeringUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // --------------------------------------------------
    // 3. CHECK ELIGIBILITY
    // --------------------------------------------------

    /*
      If eligibleYears is empty/missing, the event is
      considered open to all years.

      Otherwise, the user's year must be present
      inside event.eligibleYears.
    */

    const eligibleYears =
      Array.isArray(event.eligibleYears)
        ? event.eligibleYears
        : [];

    const isEligible =
      eligibleYears.length === 0 ||
      eligibleYears.includes(registeringUser.year);

    if (!isEligible) {
      return res.status(403).json({
        message: `You are not eligible for this event. This event is open to: ${eligibleYears.join(', ')}.`
      });
    }

    // --------------------------------------------------
    // 4. Check registration deadline
    // --------------------------------------------------
    if (new Date() >= event.registrationDeadline) {
      return res.status(400).json({
        message: 'Registration deadline has passed'
      });
    }

    // --------------------------------------------------
    // 5. Check capacity
    // --------------------------------------------------
    if (event.attendees >= event.capacity) {
      return res.status(400).json({
        message: 'Event is full'
      });
    }

    // --------------------------------------------------
    // 6. Find event organizer
    // --------------------------------------------------
    const organizer = await User.findById(event.organizerId);

    // --------------------------------------------------
    // 7. Create booking
    // --------------------------------------------------
    const booking = new Booking({
      userId,
      eventId
    });

    await booking.save();

    // --------------------------------------------------
    // 8. Update event
    // --------------------------------------------------
    event.attendees += 1;
    event.participants.push(userId);

    await event.save();

    // --------------------------------------------------
    // 9. Send notification
    // --------------------------------------------------
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

    // --------------------------------------------------
    // 10. Success response
    // --------------------------------------------------
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
