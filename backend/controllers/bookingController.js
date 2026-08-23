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

    const eligibleYears =
      Array.isArray(event.eligibleYears)
        ? event.eligibleYears
        : [];

    const isEligible =
      eligibleYears.length === 0 ||
      eligibleYears.includes(registeringUser.year);

    if (!isEligible) {
      return res.status(403).json({
        code: 'NOT_ELIGIBLE',
        message: `You are not eligible for this event. This event is open to: ${eligibleYears.join(', ')}.`
      });
    }


    // --------------------------------------------------
    // 4. CHECK DUPLICATE REGISTRATION
    // --------------------------------------------------

    const existingBooking = await Booking.findOne({
      userId,
      eventId
    });

    if (existingBooking) {
      return res.status(409).json({
        code: 'ALREADY_REGISTERED',
        message: 'You are already registered for this event.'
      });
    }


    // --------------------------------------------------
    // 5. Check registration deadline
    // --------------------------------------------------

    if (new Date() >= event.registrationDeadline) {
      return res.status(400).json({
        code: 'REGISTRATION_CLOSED',
        message: 'Registration deadline has passed.'
      });
    }


    // --------------------------------------------------
    // 6. Check capacity
    // --------------------------------------------------

    if (event.attendees >= event.capacity) {
      return res.status(400).json({
        code: 'EVENT_FULL',
        message: 'Event is full.'
      });
    }


    // --------------------------------------------------
    // 7. Find organizer
    // --------------------------------------------------

    const organizer = await User.findById(
      event.organizerId
    );


    // --------------------------------------------------
    // 8. Create booking
    // --------------------------------------------------

    let booking;

    try {

      booking = new Booking({
        userId,
        eventId
      });

      await booking.save();

    } catch (bookingError) {

      // ----------------------------------------------
      // MongoDB duplicate-key protection
      // ----------------------------------------------
      //
      // This handles the situation where two
      // registration requests arrive at almost
      // exactly the same time.
      //
      // The unique index in Booking.js prevents
      // both from being inserted.
      //

      if (bookingError.code === 11000) {

        return res.status(409).json({
          code: 'ALREADY_REGISTERED',
          message: 'You are already registered for this event.'
        });

      }

      throw bookingError;
    }


    // --------------------------------------------------
    // 9. Update event
    // --------------------------------------------------

    event.attendees += 1;

    event.participants.push(userId);

    await event.save();


    // --------------------------------------------------
    // 10. Send notification
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
    // 11. Success response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      code: 'REGISTERED',
      message: 'Registration successful',
      booking
    });


  } catch (error) {

    console.error(
      'Registration error:',
      error
    );

    return res.status(500).json({
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
