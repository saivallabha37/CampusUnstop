const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  eligibleYears: {
    type: [String],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    default: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  tags: [{
    type: String
  }],
  recommendations: {
    type: String
  },
  prerequisites: {
    type: String
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
