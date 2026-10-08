const User = require('../models/User');

const syncUser = async (req, res) => {
  try {
    const { uid, email } = req.firebaseUser;

    // Case A: Firebase UID exists and belongs to the same MongoDB user
    let user = await User.findOne({ firebaseUid: uid });
    if (user) {
      if (user.email !== email) {
        return res.status(400).json({ message: 'Identity mismatch detected.' });
      }
      return res.json({ message: 'Login successful', user: getSafeUser(user) });
    }

    // Case B & D: Look up by verified email
    user = await User.findOne({ email });
    if (user) {
      if (user.firebaseUid && user.firebaseUid !== uid) {
        // Case D: Firebase UID belongs to one MongoDB user but verified email matches another
        return res.status(400).json({ message: 'Account linking conflict. Email belongs to another Firebase user.' });
      }

      // Case B: Verified Firebase email matches an existing MongoDB user with no firebaseUid
      try {
        const linkedUser = await User.findOneAndUpdate(
          { _id: user._id, firebaseUid: { $exists: false } },
          { $set: { firebaseUid: uid } },
          { new: true }
        );
        if (linkedUser) {
          return res.json({ message: 'Legacy account migrated successfully', user: getSafeUser(linkedUser) });
        } else {
          // Case E: Race condition handled
          user = await User.findOne({ firebaseUid: uid });
          if (user) return res.json({ message: 'Login successful', user: getSafeUser(user) });
          throw new Error('Concurrent linking occurred.');
        }
      } catch (err) {
        return res.status(500).json({ message: 'Server error during linking', error: err.message });
      }
    }

    // Case C: No Firebase UID and no matching MongoDB email -> Create new
    const { name, phone, college, year, branch } = req.body;
    
    // Validate required profile data is present
    if (!name || !phone || !college || !year || !branch) {
      return res.status(422).json({ 
        message: 'Missing required profile fields', 
        needsProfile: true 
      });
    }

    try {
      user = new User({
        firebaseUid: uid,
        email,
        name,
        phone,
        college,
        year,
        branch
      });
      await user.save();
      return res.status(201).json({ message: 'Registration successful', user: getSafeUser(user) });
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        // Case E: Race condition where user was created concurrently
        user = await User.findOne({ firebaseUid: uid });
        if (user) return res.json({ message: 'Login successful', user: getSafeUser(user) });
      }
      throw saveErr;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSafeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    year: user.year,
    branch: user.branch,
    role: user.role
  };
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const editableFields = ['name', 'phone', 'college', 'branch'];
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field]])
    );

    if (updates.phone !== undefined && !/^[0-9+()\-\s]{7,20}$/.test(updates.phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    for (const field of editableFields) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    }

    await user.save();
    
    res.json({ user: getSafeUser(user) });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please enter valid profile details.' });
    }

    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Unable to update profile right now.' });
  }
};

module.exports = {
  syncUser,
  getUserProfile,
  updateUserProfile
};