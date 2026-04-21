const express = require('express');
const router = express.Router();
const { processQuery, getHistory } = require('../controllers/apiController');
const { protect } = require('../middleware/auth');

// Main comprehensive endpoint that does everything as required.
router.post('/research', protect, processQuery);

// Fetch chat history
router.get('/history', protect, getHistory);

module.exports = router;
