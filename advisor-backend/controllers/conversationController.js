const Conversation = require('../models/Conversation');

// Create new conversation
exports.createConversation = async (req, res) => {
  try {
    const conversation = new Conversation({
      userId: req.body.userId || 'anonymous',
      messages: []
    });
    await conversation.save();
    console.log('Created conversation:', conversation._id);
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get conversation by ID
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add message to conversation
exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    conversation.messages.push({
      role: req.body.role || 'user',
      content: req.body.content
    });
    
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update conversation profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    conversation.profile = { ...conversation.profile, ...req.body };
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark conversation as complete
exports.completeConversation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    conversation.completed = true;
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
