const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_OPTIONS = {
  httpOnly: true,                                      // JS cannot read this cookie
  secure: process.env.NODE_ENV === 'production',       // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' needed for cross-origin in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,                   // 7 days in ms
};

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/admin/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user);

    // Set token as httpOnly cookie — JS can never read it
    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/auth/logout
exports.logout = (_req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out' });
};

// POST /api/admin/auth/register  (requires valid JWT — superadmin creates new users)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email, and password are required' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role: role || 'admin' });

    res.status(201).json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/auth/users  (superadmin only)
exports.listUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users.map(u => u.toJSON()) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/auth/users/:id  (superadmin only)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (req.params.id === String(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/auth/me
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/auth/me  — update name, email, and/or password
exports.updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new one' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
      user.passwordHash = await User.hashPassword(newPassword);
    }

    await user.save();
    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};
