const express = require('express');
const router = express.Router();
const { analyzeBehavior, getHistory, deleteMyEntry, clearMyHistory } = require('../controllers/analysisController');
const learningRoutes = require('./learningRoutes');

const { protect } = require('../middleware/authMiddleware');

// Define API routes
router.post('/analyze', protect, analyzeBehavior);
router.get('/history', protect, getHistory);
router.delete('/history', protect, clearMyHistory);
router.delete('/history/:id', protect, deleteMyEntry);

// Mount Learning Routes
router.use('/learning', learningRoutes);

module.exports = router;
