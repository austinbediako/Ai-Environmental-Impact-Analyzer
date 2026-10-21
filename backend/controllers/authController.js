const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please add all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate name (alphabets only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'Name must contain only alphabets and spaces' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const role = (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL === email) ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
      authProvider: 'local'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const newName = req.body.name || user.name;
      
      // Validate name (alphabets only)
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(newName)) {
        return res.status(400).json({ error: 'Name must contain only alphabets and spaces' });
      }

      user.name = newName;
      
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// @desc    Get Gamification Leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select('name points level badges')
      .sort({ points: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving leaderboard' });
  }
};
