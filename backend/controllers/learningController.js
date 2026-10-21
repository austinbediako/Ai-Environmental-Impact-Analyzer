const Article = require('../models/Article');
const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');

// Helper to calculate level based on points
const calculateLevel = (points) => {
  return Math.floor(points / 50) + 1;
};

// @desc    Submit an article for review
// @route   POST /api/learning/articles
// @access  Private
exports.submitArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Please provide a title and content.' });
    }

    // Automatic approval for admins
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const article = await Article.create({
      title,
      content,
      authorId: req.user._id,
      authorName: req.user.name,
      status
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error occurred while submitting article.' });
  }
};

// @desc    Get current user's articles
// @route   GET /api/learning/my-articles
// @access  Private
exports.getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error occurred while fetching your articles.' });
  }
};

// @desc    Request an update for an existing article
// @route   POST /api/learning/articles/:id/request-update
// @access  Private
exports.requestArticleUpdate = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ error: 'Article not found' });
    if (article.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to edit this article' });
    }

    article.isUpdateRequested = true;
    article.updateRequest = { title, content };
    await article.save();

    res.json({ success: true, message: 'Update request submitted to moderators.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error requesting update' });
  }
};

// @desc    Request deletion for an existing article
// @route   POST /api/learning/articles/:id/request-deletion
// @access  Private
exports.requestArticleDeletion = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ error: 'Article not found' });
    if (article.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this article' });
    }

    article.isDeletionRequested = true;
    await article.save();

    res.json({ success: true, message: 'Deletion request submitted to moderators.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error requesting deletion' });
  }
};

// @desc    Cancel a pending deletion request
// @route   POST /api/learning/articles/:id/cancel-deletion
// @access  Private
exports.cancelArticleDeletionRequest = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ error: 'Article not found' });
    if (article.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    article.isDeletionRequested = false;
    await article.save();

    res.json({ success: true, message: 'Deletion request cancelled.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error cancelling deletion request' });
  }
};

// @desc    Get all APPROVED articles
// @route   GET /api/learning/articles
// @access  Private
exports.getApprovedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'approved' }).sort({ createdAt: -1 });
    // Keep it minimal and public to authenticated users
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error occurred while fetching articles.' });
  }
};

// @desc    Get all questions for quiz module
// @route   GET /api/learning/quiz
// @access  Private
exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find({}).sort({ createdAt: -1 });
    
    // We intentionally do NOT send the correctAnswerIndex or explanation to the client to prevent cheating
    const safeQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      pointsAwarded: q.pointsAwarded
    }));

    res.status(200).json({ success: true, count: safeQuestions.length, data: safeQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error occurred while fetching quiz.' });
  }
};

// @desc    Submit quiz answers and award points
// @route   POST /api/learning/quiz
// @access  Private
exports.submitQuizAnswers = async (req, res) => {
  try {
    // Expected payload: answers = { [questionId]: selectedOptionIndex }
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers payload' });
    }

    const questions = await QuizQuestion.find({ _id: { $in: Object.keys(answers) } });
    
    let totalPointsAwarded = 0;
    const feedback = [];

    questions.forEach(q => {
      const userIndex = answers[q._id.toString()];
      const isCorrect = userIndex === q.correctAnswerIndex;
      
      if (isCorrect) {
        totalPointsAwarded += q.pointsAwarded;
      }
      
      feedback.push({
        questionId: q._id,
        isCorrect,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation
      });
    });

    if (totalPointsAwarded > 0) {
      const user = await User.findById(req.user._id);
      user.points += totalPointsAwarded;
      user.level = calculateLevel(user.points);
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        totalPointsAwarded,
        feedback
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error occurred while verifying quiz.' });
  }
};
