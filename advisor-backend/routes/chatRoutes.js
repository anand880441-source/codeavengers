const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send message and get AI response
router.post('/:id/messages', chatController.sendMessage);

// Get next question suggestion
router.get('/:id/next-question', chatController.getNextQuestion);

// Check if conversation is complete
router.get('/:id/complete', chatController.checkComplete);

module.exports = router;
