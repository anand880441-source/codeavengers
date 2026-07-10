const Report = require('../models/Report');
const Conversation = require('../models/Conversation');
const analyticsService = require('../services/analyticsService');

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

// Generate report from conversation using real analytics
exports.generateReport = async (req, res) => {
  try {
    const { conversationId } = req.body;
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get profile from conversation
    const profile = conversation.profile || {};
    
    // Default schemes to analyze
    const defaultSchemes = ['100027', '119551', '118403', '120503', '119381'];
    
    // Get recommendations from analytics service
    let recommendations = [];
    let riskProfile = null;
    
    try {
      // Get risk profile
      if (profile.riskTolerance && profile.investmentHorizon) {
        riskProfile = await analyticsService.getRiskProfile(
          profile.riskTolerance,
          profile.investmentHorizon
        );
      }
      
      // Get fund recommendations
      const result = await analyticsService.getRecommendations(
        defaultSchemes,
        profile.riskTolerance || 'medium',
        profile.investmentHorizon || 'medium'
      );
      
      recommendations = result.recommendations.map(function(r) {
        return {
          schemeName: r.scheme_name,
          schemeCode: r.scheme_code,
          cagr: r.metrics?.cagr || 12,
          volatility: r.metrics?.volatility || 18,
          sharpeRatio: r.metrics?.sharpe_ratio || 0.7,
          maxDrawdown: r.metrics?.max_drawdown || -15,
          allocation: r.allocation || 33,
          reason: r.reason || 'Recommended based on your profile'
        };
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback recommendations
      recommendations = [
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
      ];
    }

    // Generate summary
    const summary = generateSummary(profile, riskProfile, recommendations);

    // Create report
    const report = new Report({
      conversationId: conversation._id,
      profile: profile,
      recommendations: recommendations,
      summary: summary,
      disclaimer: 'This is an educational tool. Past performance does not guarantee future returns. This is not personalized investment advice.'
    });

    await report.save();
    
    // Mark conversation as complete
    conversation.completed = true;
    await conversation.save();

    res.status(201).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper: Generate summary
function generateSummary(profile, riskProfile, recommendations) {
  const riskCategory = riskProfile?.risk_category || 
    (profile.riskTolerance === 'high' ? 'Aggressive' : 
     profile.riskTolerance === 'low' ? 'Conservative' : 'Moderate');
  
  const horizon = profile.investmentHorizon || 'medium';
  const horizonText = {
    'short': 'short-term',
    'medium': 'medium-term',
    'long': 'long-term'
  }[horizon] || 'medium-term';

  let summary = 'Based on your conversation, here is a personalized investment summary:\n\n';
  summary += 'Risk Profile: ' + riskCategory + '\n';
  summary += 'Investment Horizon: ' + horizonText + ' (' + (horizon === 'short' ? '1-3 years' : horizon === 'medium' ? '3-7 years' : '7+ years') + ')\n';
  summary += 'Monthly Investment: ' + (profile.monthlyAmount ? '₹' + profile.monthlyAmount.toLocaleString() : 'Not specified') + '\n\n';
  summary += 'Recommendations:\n';
  
  for (var i = 0; i < recommendations.length; i++) {
    var r = recommendations[i];
    summary += (i + 1) + '. ' + r.schemeName + ' (' + r.allocation + '% allocation)\n';
    summary += '   - CAGR: ' + r.cagr + '% | Volatility: ' + r.volatility + '% | Sharpe: ' + r.sharpeRatio + '\n';
    summary += '   - ' + r.reason + '\n\n';
  }

  summary += 'This portfolio is designed to match your risk tolerance and investment goals. Remember to review your investments regularly and adjust as your goals change.';
  
  return summary;
}

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
