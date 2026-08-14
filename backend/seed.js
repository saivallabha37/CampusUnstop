const mongoose = require('mongoose');
const Event = require('./models/Event');

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/event_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const seedEvents = async () => {
  try {
    // Clear existing events
    await Event.deleteMany({});

    const events = [
      {
        title: 'Tech Hackathon 2026',
        description: 'A 48-hour coding challenge to build innovative solutions.',
        date: new Date('2026-06-15'),
        location: 'Main Campus Auditorium',
        capacity: 100,
        category: 'Technology',
        registrationDeadline: new Date('2026-06-10'),
        attendees: 45,
        recommendations: 'Bring your laptop, charger, and any development tools you prefer.',
        prerequisites: 'Basic programming knowledge in any language.',
        participants: [] // Will be populated when users register
      },
      {
        title: 'Business Seminar',
        description: 'Learn from industry leaders about entrepreneurship and startups.',
        date: new Date('2026-05-20'),
        location: 'Business School Hall',
        capacity: 50,
        category: 'Business',
        registrationDeadline: new Date('2026-05-15'),
        attendees: 30,
        recommendations: 'Come prepared with questions for the speakers.',
        prerequisites: 'Interest in business and entrepreneurship.',
        participants: []
      },
      {
        title: 'Art Workshop',
        description: 'Express your creativity through various art mediums.',
        date: new Date('2026-07-10'),
        location: 'Art Studio',
        capacity: 30,
        category: 'Arts',
        registrationDeadline: new Date('2026-07-05'),
        attendees: 15,
        recommendations: 'Wear comfortable clothes that can get messy.',
        prerequisites: 'No prior art experience required.',
        participants: []
      }
    ];

    await Event.insertMany(events);
    console.log('Events seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();