const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  profile: {
    investmentHorizon: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: null
    },
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: null
    },
    goal: {
      type: String,
      default: null
    },
    monthlyAmount: {
      type: Number,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    incomeStability: {
      type: String,
      enum: ['stable', 'unstable'],
      default: null
    }
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
