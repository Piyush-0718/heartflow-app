const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Message Content
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'emoji', 'audio'],
    default: 'text',
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  replyMeta: {
    text: String,
    type: {
      type: String,
      enum: ['text', 'image', 'emoji', 'audio'],
      default: 'text',
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  
  // Moderation
  isModerated: {
    type: Boolean,
    default: false,
  },
  moderationFlags: [String],
  
  // Status
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
