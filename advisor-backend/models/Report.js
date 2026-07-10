const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
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
  recommendations: [{
    schemeName: {
      type: String,
      required: true
    },
    schemeCode: {
      type: String,
      required: true
    },
    cagr: {
      type: Number,
      required: true
    },
    volatility: {
      type: Number,
      required: true
    },
    sharpeRatio: {
      type: Number,
      required: true
    },
    maxDrawdown: {
      type: Number,
      required: true
    },
    allocation: {
      type: Number,
      default: 0
    },
    reason: {
      type: String,
      default: ''
    }
  }],
  summary: {
    type: String,
    required: true
  },
  disclaimer: {
    type: String,
    default: 'This is an educational tool. Past performance does not guarantee future returns. This is not personalized investment advice.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
