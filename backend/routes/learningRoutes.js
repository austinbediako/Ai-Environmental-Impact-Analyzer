const express = require('express');
const router = express.Router();
const { 
  submitArticle, 
  getApprovedArticles, 
  getQuizQuestions, 
  submitQuizAnswers,
  getMyArticles,
  requestArticleUpdate,
  requestArticleDeletion,
  cancelArticleDeletionRequest
} = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes
router.post('/articles', protect, submitArticle);
router.get('/articles', protect, getApprovedArticles);
router.get('/my-articles', protect, getMyArticles);
router.post('/articles/:id/request-update', protect, requestArticleUpdate);
router.post('/articles/:id/request-deletion', protect, requestArticleDeletion);
router.post('/articles/:id/cancel-deletion', protect, cancelArticleDeletionRequest);
router.get('/quiz', protect, getQuizQuestions);
router.post('/quiz', protect, submitQuizAnswers);

module.exports = router;
