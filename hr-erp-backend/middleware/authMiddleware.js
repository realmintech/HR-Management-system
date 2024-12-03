const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith('Bearer')) {
      return res.status(401).json({ 
        message: 'Authentication required. Please provide a valid Bearer token' 
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication failed. Token is missing' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ 
          message: 'Authentication failed. User no longer exists' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          message: 'Authentication failed. Invalid or expired token' 
        });
      }
      throw error; 
    }
  } catch (error) {
    console.error('Authentication Middleware Error:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication' 
    });
  }
};
// Optional: Add admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
