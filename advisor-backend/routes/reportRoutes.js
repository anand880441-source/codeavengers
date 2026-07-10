const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get report by ID
router.get('/:id', reportController.getReport);

// Generate report from conversation
router.post('/generate', reportController.generateReport);

// Get all reports for a conversation
router.get('/conversation/:conversationId', reportController.getReportsByConversation);

module.exports = router;
