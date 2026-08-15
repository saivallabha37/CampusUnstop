const Event = require('../models/Event');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      capacity,
      category,
      description,
      registrationDeadline,
      location,
      imageUrl,
      tags,
      organizerId
    } = req.body;

    const event = new Event({
      title,
      date,
      capacity,
      category,
      description,
      registrationDeadline,
      location,
      imageUrl,
      tags,
      organizerId,
      attendees: 0
    });

    await event.save();

    // Get the event creator
    const organizer = await User.findById(organizerId);

    // Get all registered users
    const users = await User.find(
    { _id: { $ne: organizerId } },
      'name email'
    );

    // Send notification to all users + event creator
    await sendNotification({
      type: 'EVENT_CREATED',

      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category,
        registrationDeadline: event.registrationDeadline,
        capacity: event.capacity
      },

      // All users who should receive the new-event notification
      recipients: users.map(user => ({
        name: user.name,
        email: user.email
      })),

      // The person who created the event
      organizer: organizer
        ? {
            id: organizer._id,
            name: organizer.name,
            email: organizer.email
          }
        : null
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const getEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.params.organizerId
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const searchEvents = async (req, res) => {
  try {
    const { q, category } = req.query;

    let query = {};

    if (q) {
      query.$or = [
        {
          title: {
            $regex: q,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: q,
            $options: 'i'
          }
        },
        {
          tags: {
            $in: [new RegExp(q, 'i')]
          }
        }
      ];
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: 'i'
      };
    }

    const events = await Event.find(query);

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  getEventsByOrganizer,
  searchEvents,
  updateEvent,
  deleteEvent
};
