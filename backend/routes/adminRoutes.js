const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getAllHistory, 
  getUserHistory, 
  createAdmin, 
  deleteHistory, 
  deleteUser, 
  getPendingArticles, 
  reviewArticle, 
  createQuizQuestion, 
  deleteQuizQuestion,
  deleteGlobalArticle
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/create-admin').post(protect, admin, createAdmin);
router.route('/history').get(protect, admin, getAllHistory);
router.route('/history/:id').delete(protect, admin, deleteHistory);
router.route('/users/:id/history').get(protect, admin, getUserHistory);

// Learning content management
router.route('/articles/pending').get(protect, admin, getPendingArticles);
router.route('/articles/:id/review').put(protect, admin, reviewArticle);
router.route('/articles/:id').delete(protect, admin, deleteGlobalArticle);
router.route('/quiz').post(protect, admin, createQuizQuestion);
router.route('/quiz/:id').delete(protect, admin, deleteQuizQuestion);

module.exports = router;
