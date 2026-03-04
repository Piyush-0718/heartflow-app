const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Reporter
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Reported User/Content
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedContent: {
    type: String,
    enum: ['profile', 'message', 'photo', 'behavior'],
    required: true,
  },
  
  // Report Details
  reason: {
    type: String,
    enum: [
      'inappropriate_content',
      'harassment',
      'fake_profile',
      'spam',
      'underage',
      'hate_speech',
      'violence',
      'nudity',
      'scam',
      'other',
    ],
    required: true,
  },
  description: String,
  
  // Evidence
  screenshots: [String],
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending',
  },
  
  // Resolution
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: Date,
  resolution: {
    type: String,
    enum: ['warning', 'suspension', 'ban', 'no_action'],
  },
  resolutionNotes: String,
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
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
reportSchema.index({ status: 1, priority: -1, createdAt: -1 });
reportSchema.index({ reportedUser: 1 });

// Update timestamp on save
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
