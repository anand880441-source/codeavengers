const Conversation = require('../models/Conversation');
const ollamaService = require('../services/ollamaService');

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Check if id is valid
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    // Find conversation
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: content
    });

    console.log('Getting AI response for:', content);

    // Get AI response (with fallback)
    let aiResponse = '';
    try {
      aiResponse = await ollamaService.getConversationResponse(
        conversation.messages.slice(0, -1),
        content,
        conversation.profile
      );
    } catch (error) {
      console.error('Ollama error, using fallback:', error.message);
      aiResponse = 'I understand you want to invest. Could you tell me more about your investment goals and risk tolerance? This will help me provide better guidance.';
    }

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    // Try to extract profile info from conversation
    await extractProfile(conversation);

    await conversation.save();

    res.json({
      message: aiResponse,
      conversation: conversation
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Extract profile information from conversation
async function extractProfile(conversation) {
  const messages = conversation.messages;
  const profile = conversation.profile || {};

  const text = messages.map(m => m.content).join(' ').toLowerCase();

  // Extract risk tolerance
  if (!profile.riskTolerance) {
    if (text.includes('high risk') || text.includes('aggressive') || text.includes('maximum returns')) {
      profile.riskTolerance = 'high';
    } else if (text.includes('low risk') || text.includes('conservative') || text.includes('safe') || text.includes('protect')) {
      profile.riskTolerance = 'low';
    } else if (text.includes('moderate') || text.includes('medium') || text.includes('balanced')) {
      profile.riskTolerance = 'medium';
    }
  }

  // Extract investment horizon
  if (!profile.investmentHorizon) {
    if (text.includes('short term') || text.includes('1 year') || text.includes('2 year') || text.includes('few months')) {
      profile.investmentHorizon = 'short';
    } else if (text.includes('long term') || text.includes('10 year') || text.includes('retirement') || text.includes('future')) {
      profile.investmentHorizon = 'long';
    } else if (text.includes('medium') || text.includes('5 year')) {
      profile.investmentHorizon = 'medium';
    }
  }

  // Extract monthly amount (contextual matches to avoid capturing age)
  if (!profile.monthlyAmount) {
    const amountRegexes = [
      /(?:invest|amount|rs\.?|₹|saving|monthly)\s*(\d+)\s*(k|thousand|lakh|crore)?/i,
      /(\d+)\s*(k|thousand|lakh|crore)?\s*(?:per\s*month|monthly|a\s*month|p\.?m\.?)/i
    ];
    
    let match = null;
    for (const regex of amountRegexes) {
      match = text.match(regex);
      if (match) break;
    }
    
    if (!match) {
      // Fallback: match any number that is NOT followed by year/age terms
      const allNumbers = [...text.matchAll(/(\d+)\s*(k|thousand|lakh|crore)?/gi)];
      for (const m of allNumbers) {
        const numIndex = m.index;
        const surroundingText = text.substring(numIndex, numIndex + 30);
        if (!/years?|yrs?|y(?:\s|$)|old|age/i.test(surroundingText)) {
          match = m;
          break;
        }
      }
    }

    if (match) {
      let amount = parseInt(match[1]);
      const unit = (match[2] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') amount *= 1000;
      if (unit === 'lakh') amount *= 100000;
      if (unit === 'crore') amount *= 10000000;
      
      if (amount > 100) {
        profile.monthlyAmount = amount;
      }
    }
  }

  // Extract age
  if (!profile.age) {
    const ageRegexes = [
      /(?:i\s*am|age|old)\s*(\d+)\s*(?:years?|yrs?|y)?/i,
      /(\d+)\s*(?:years?\s*old|years?\s*of\s*age|yrs?\s*old)/i
    ];
    let match = null;
    for (const regex of ageRegexes) {
      match = text.match(regex);
      if (match) break;
    }
    
    if (match) {
      const ageVal = parseInt(match[1]);
      if (ageVal > 15 && ageVal < 100) {
        profile.age = ageVal;
      }
    }
  }

  // Extract goal
  if (!profile.goal) {
    if (text.includes('retirement') || text.includes('retire')) {
      profile.goal = 'retirement';
    } else if (text.includes('education') || text.includes('child') || text.includes('college') || text.includes('study')) {
      profile.goal = 'education';
    } else if (text.includes('wealth') || text.includes('grow') || text.includes('growth') || text.includes('save') || text.includes('creation')) {
      profile.goal = 'wealth creation';
    } else if (text.includes('home') || text.includes('house') || text.includes('property')) {
      profile.goal = 'home purchase';
    } else if (text.includes('car') || text.includes('vehicle')) {
      profile.goal = 'car purchase';
    }
  }

  // Check if profile is complete
  const requiredFields = ['riskTolerance', 'investmentHorizon', 'monthlyAmount'];
  const hasAll = requiredFields.every(f => profile[f] !== null && profile[f] !== undefined);
  
  if (hasAll && !conversation.completed) {
    conversation.completed = true;
  }

  conversation.profile = profile;
}

// Get AI suggestion for next question
exports.getNextQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const profile = conversation.profile || {};
    const missing = [];

    if (!profile.riskTolerance) missing.push('risk tolerance');
    if (!profile.investmentHorizon) missing.push('investment horizon');
    if (!profile.monthlyAmount) missing.push('monthly investment amount');
    if (!profile.goal) missing.push('investment goal');
    if (!profile.age) missing.push('age');

    if (missing.length === 0) {
      return res.json({
        message: 'Great! I have all the information I need. Would you like me to generate a report?',
        isComplete: true
      });
    }

    const questionPrompts = {
      'risk tolerance': 'How comfortable are you with risk? Are you looking for high returns with high risk, or safer investments with lower returns?',
      'investment horizon': 'How long do you plan to invest? Short term (1-2 years), medium term (3-5 years), or long term (10+ years)?',
      'monthly investment amount': 'How much are you planning to invest monthly?',
      'investment goal': 'What is your investment goal? Retirement, education, wealth creation, or something else?',
      'age': 'May I know your age? This helps me suggest appropriate investment strategies.'
    };

    const nextQuestion = questionPrompts[missing[0]] || 'Tell me more about your investment preferences.';

    res.json({
      message: nextQuestion,
      missingFields: missing,
      isComplete: false
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if conversation is complete
exports.checkComplete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const profile = conversation.profile || {};
    const requiredFields = ['riskTolerance', 'investmentHorizon', 'monthlyAmount'];
    const hasAll = requiredFields.every(f => profile[f] !== null && profile[f] !== undefined);

    res.json({
      isComplete: hasAll || conversation.completed,
      profile: profile
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
