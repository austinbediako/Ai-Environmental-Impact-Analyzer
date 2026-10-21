const User = require('../models/User');
const BehaviorLog = require('../models/BehaviorLog');
const Article = require('../models/Article');
const QuizQuestion = require('../models/QuizQuestion');

// @desc    Create an admin user
// @route   POST /api/admin/create-admin
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      authProvider: 'local'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating admin' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error retrieving users' });
  }
};

// @desc    Get all histories across platform
// @route   GET /api/admin/history
// @access  Private/Admin
exports.getAllHistory = async (req, res) => {
  try {
    const entries = await BehaviorLog.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error retrieving all histories' });
  }
};

// @desc    Get specific user's history
// @route   GET /api/admin/users/:id/history
// @access  Private/Admin
exports.getUserHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await BehaviorLog.find({ userId: id }).sort({ createdAt: -1 });
    if (!entries) {
      return res.status(404).json({ error: 'No history found' });
    }
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error retrieving specific history' });
  }
};

// @desc    Hard delete a history entry from the platform
// @route   DELETE /api/admin/history/:id
// @access  Private/Admin
exports.deleteHistory = async (req, res) => {
  try {
    const entry = await BehaviorLog.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'History explicitly deleted from DB' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error deleting history' });
  }
};

// @desc    Delete a user and their analysis history (Cascade)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete all history entries for this user
    await BehaviorLog.deleteMany({ userId: userId });

    // 2. Delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User and linked history deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error deleting user' });
  }
};

// @desc    Get all pending articles and requests for review
// @route   GET /api/admin/articles/pending
// @access  Private/Admin
exports.getPendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      $or: [
        { status: 'pending' },
        { isUpdateRequested: true },
        { isDeletionRequested: true }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error retrieving pending articles' });
  }
};

// @desc    Approve or Reject an article submission or request
// @route   PUT /api/admin/articles/:id/review
// @access  Private/Admin
exports.reviewArticle = async (req, res) => {
  try {
    const { status, type } = req.body; // type can be 'submission', 'update', or 'deletion'
    
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (type === 'submission') {
      article.status = status;
    } else if (type === 'update') {
      if (status === 'approved') {
        article.title = article.updateRequest.title;
        article.content = article.updateRequest.content;
      }
      article.isUpdateRequested = false;
      article.updateRequest = undefined;
    } else if (type === 'deletion') {
      if (status === 'approved') {
        await Article.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: 'Article deleted' });
      }
      article.isDeletionRequested = false;
    }

    await article.save();
    res.json({ success: true, data: article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error updating article status' });
  }
};

// @desc    Hard delete any article
// @route   DELETE /api/admin/articles/:id
// @access  Private/Admin
exports.deleteGlobalArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true, message: 'Article permanently removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error deleting article' });
  }
};

// @desc    Create a new Quiz Question
// @route   POST /api/admin/quiz
// @access  Private/Admin
exports.createQuizQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswerIndex, explanation, pointsAwarded } = req.body;
    
    if (!question || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({ error: 'Please provide question, options, and correctAnswerIndex' });
    }

    const quiz = await QuizQuestion.create({
      question,
      options,
      correctAnswerIndex,
      explanation,
      pointsAwarded
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error creating quiz question' });
  }
};

// @desc    Delete a Quiz Question
// @route   DELETE /api/admin/quiz/:id
// @access  Private/Admin
exports.deleteQuizQuestion = async (req, res) => {
  try {
    const quiz = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz question not found' });
    }
    res.json({ success: true, message: 'Quiz question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error deleting quiz question' });
  }
};
