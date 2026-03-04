const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Match Status
  status: {
    type: String,
    enum: ['pending', 'matched', 'unmatched', 'rejected'],
    default: 'pending',
  },
  
  // Who liked whom
  user1Liked: {
    type: Boolean,
    default: false,
  },
  user2Liked: {
    type: Boolean,
    default: false,
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  initiatedType: {
    type: String,
    enum: ['like', 'super_like'],
    default: 'like',
  },
  
  // Compatibility Score
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  
  // Match Details
  matchedAt: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  unmatchedAt: Date,
  unmatchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
matchSchema.index({ user1: 1, user2: 1 });
matchSchema.index({ status: 1 });

// Update timestamp on save
matchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if both users liked each other
matchSchema.methods.checkMatch = function() {
  if (this.user1Liked && this.user2Liked && this.status === 'pending') {
    this.status = 'matched';
    this.matchedAt = new Date();
    return true;
  }
  return false;
};

module.exports = mongoose.model('Match', matchSchema);
