const admin = require('../config/firebase');
const User = require('../models/User');

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    
    if (!decoded.email_verified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    req.firebaseUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

const requireCampusUser = async (req, res, next) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({ message: 'Firebase authentication required' });
    }

    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    
    if (!user) {
      return res.status(403).json({ message: 'Account not linked. Please sync your profile.' });
    }

    // Attach MongoDB user information
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

const authMiddleware = [verifyFirebaseToken, requireCampusUser];

module.exports = authMiddleware;
module.exports.verifyFirebaseToken = verifyFirebaseToken;
module.exports.requireCampusUser = requireCampusUser;