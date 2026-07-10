const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Create new conversation
router.post('/', conversationController.createConversation);

// Get conversation by ID
router.get('/:id', conversationController.getConversation);

// Add message to conversation
router.post('/:id/messages', conversationController.addMessage);

// Update conversation profile
router.put('/:id/profile', conversationController.updateProfile);

// Mark conversation as complete
router.put('/:id/complete', conversationController.completeConversation);

module.exports = router;
