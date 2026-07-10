const Conversation = require('../models/Conversation');
const groqService = require('./groqService');

exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.messages.push({ role: 'user', content: content });
    console.log('Getting AI response for:', content);

    let aiResponse = await groqService.getConversationResponse(
      conversation.messages.slice(0, -1),
      content,
      conversation.profile
    );

    conversation.messages.push({ role: 'assistant', content: aiResponse });
    await extractProfile(conversation);
    await conversation.save();

    res.json({ message: aiResponse, conversation: conversation });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

async function extractProfile(conversation) {
  const messages = conversation.messages;
  const profile = conversation.profile || {};
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
  const text = userMessages.join(' ').toLowerCase();

  if (!profile.riskTolerance) {
    if (text.includes('high risk') || text.includes('aggressive') || text.includes('maximum returns')) {
      profile.riskTolerance = 'high';
    } else if (text.includes('low risk') || text.includes('conservative') || text.includes('safe')) {
      profile.riskTolerance = 'low';
    } else if (text.includes('moderate') || text.includes('medium') || text.includes('balanced')) {
      profile.riskTolerance = 'medium';
    }
  }

  if (!profile.investmentHorizon) {
    if (text.includes('short term') || text.includes('1 year') || text.includes('2 year')) {
      profile.investmentHorizon = 'short';
    } else if (text.includes('long term') || text.includes('10 year') || text.includes('retirement')) {
      profile.investmentHorizon = 'long';
    } else if (text.includes('medium') || text.includes('5 year')) {
      profile.investmentHorizon = 'medium';
    }
  }

  if (!profile.monthlyAmount) {
    const match = text.match(/(?:invest|amount|monthly)\s*(\d+)/i);
    if (match) {
      const amount = parseInt(match[1]);
      if (amount > 100) profile.monthlyAmount = amount;
    }
  }

  if (!profile.age) {
    const match = text.match(/(?:i am|age|old)\s*(\d+)/i);
    if (match) {
      const age = parseInt(match[1]);
      if (age > 15 && age < 100) profile.age = age;
    }
  }

  if (!profile.goal) {
    if (text.includes('retirement')) profile.goal = 'retirement';
    else if (text.includes('education') || text.includes('child')) profile.goal = 'education';
    else if (text.includes('wealth') || text.includes('growth')) profile.goal = 'wealth creation';
  }

  const requiredFields = ['riskTolerance', 'investmentHorizon', 'monthlyAmount'];
  const hasAll = requiredFields.every(f => profile[f] !== null && profile[f] !== undefined);
  if (hasAll && !conversation.completed) conversation.completed = true;

  conversation.profile = profile;
}

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

    res.json({
      message: questionPrompts[missing[0]] || 'Tell me more about your investment preferences.',
      missingFields: missing,
      isComplete: false
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
