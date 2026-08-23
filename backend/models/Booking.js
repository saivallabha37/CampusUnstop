const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }

}, {
  timestamps: true
});


// --------------------------------------------------
// Prevent duplicate registrations
// --------------------------------------------------
//
// One user can register for one event only once.
//
// Example:
//
// userId = A
// eventId = X
//
// A + X  → allowed once
// A + X  → duplicate ❌
//
// A + Y  → allowed
// B + X  → allowed
//

bookingSchema.index(
  {
    userId: 1,
    eventId: 1
  },
  {
    unique: true
  }
);


module.exports = mongoose.model(
  'Booking',
  bookingSchema
);
