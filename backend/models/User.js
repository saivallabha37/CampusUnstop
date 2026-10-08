const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'organizer', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);