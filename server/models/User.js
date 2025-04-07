const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot be more than 50 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: {
      values: ['student', 'teacher'],
      message: '{VALUE} is not a valid role'
    },
    default: 'student',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index on email for faster lookups
UserSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema); 