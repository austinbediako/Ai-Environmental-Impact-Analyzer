const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { loginUser, getMe, registerUser, getLeaderboard, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);
router.put('/profile', protect, updateProfile);

module.exports = router;
