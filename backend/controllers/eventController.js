const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    
    // Trigger n8n webhook after event is successfully created
    const n8nWebhookUrl = process.env.N8N_EVENT_WEBHOOK_URL;
    
    if (n8nWebhookUrl) {
      try {
        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventId: event._id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            capacity: event.capacity,
            category: event.category,
            registrationDeadline: event.registrationDeadline,
            imageUrl: event.imageUrl,
            tags: event.tags,
            organizerId: event.organizerId
          })
        });
    
        if (!webhookResponse.ok) {
          console.error(
            `n8n webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`
          );
        } else {
          console.log('n8n event-created webhook triggered successfully');
        }
      } catch (webhookError) {
        console.error(
          'Failed to trigger n8n webhook:',
          webhookError.message
        );
      }
    }
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.params.organizerId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchEvents = async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
