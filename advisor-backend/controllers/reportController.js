const Report = require('../models/Report');
const Conversation = require('../models/Conversation');

// Get report by ID
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate report from conversation
exports.generateReport = async (req, res) => {
  try {
    const { conversationId } = req.body;
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Placeholder - will be replaced with real analytics in Phase 3
    const report = new Report({
      conversationId: conversation._id,
      profile: conversation.profile,
      recommendations: [
        {
          schemeName: 'SBI Small Cap Fund',
          schemeCode: '100027',
          cagr: 15.5,
          volatility: 22.3,
          sharpeRatio: 0.85,
          maxDrawdown: -18.4,
          allocation: 40,
          reason: 'Based on your investment horizon'
        },
        {
          schemeName: 'HDFC Mid-Cap Opportunities Fund',
          schemeCode: '119551',
          cagr: 14.2,
          volatility: 20.1,
          sharpeRatio: 0.79,
          maxDrawdown: -16.2,
          allocation: 30,
          reason: 'Balanced growth potential'
        },
        {
          schemeName: 'ICICI Prudential Bluechip Fund',
          schemeCode: '118403',
          cagr: 12.8,
          volatility: 18.7,
          sharpeRatio: 0.72,
          maxDrawdown: -14.8,
          allocation: 30,
          reason: 'Stable large-cap exposure'
        }
      ],
      summary: 'Based on your conversation, here are recommended funds that match your risk profile.'
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reports for a conversation
exports.getReportsByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const reports = await Report.find({ conversationId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
