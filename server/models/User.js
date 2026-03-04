const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  
  // Profile Info
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
  },
  
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isSelfieVerified: {
    type: Boolean,
    default: false,
  },
  verificationBadge: {
    type: Boolean,
    default: false,
  },
  
  // Profile Details
  bio: String,
  location: {
    city: String,
    state: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
    },
  },
  occupation: String,
  education: String,
  interests: [String],
  lookingFor: {
    type: String,
    enum: ['relationship', 'dating', 'friendship', 'open'],
  },
  
  // Photos
  photos: [{
    url: String,
    isPrimary: Boolean,
    uploadedAt: Date,
  }],
  
  // Personality Prompts
  prompts: [{
    question: String,
    answer: String,
  }],
  
  // Preferences
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 50 },
    },
    distance: { type: Number, default: 50 }, // in km
    gender: [String],
    showOnline: { type: Boolean, default: true },
    showDistance: { type: Boolean, default: true },
  },
  
  // Privacy Settings
  privacy: {
    showProfile: { type: Boolean, default: true },
    showLastSeen: { type: Boolean, default: true },
    allowMessages: { type: String, enum: ['everyone', 'matches', 'none'], default: 'matches' },
  },

  // User-level chat safety controls
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'deleted'],
    default: 'active',
  },
  suspensionReason: String,
  suspensionExpiry: Date,
  
  // Activity
  lastActive: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  
  // Stats
  profileViews: {
    type: Number,
    default: 0,
  },
  likesReceived: {
    type: Number,
    default: 0,
  },
  
  // Admin
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },

  // Internal bot accounts used for demo conversations
  isBot: {
    type: Boolean,
    default: false,
  },
  botKey: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
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

// Calculate age from date of birth
userSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is verified
userSchema.methods.isFullyVerified = function() {
  return this.isEmailVerified && this.isPhoneVerified && this.isSelfieVerified;
};

// Hide sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
