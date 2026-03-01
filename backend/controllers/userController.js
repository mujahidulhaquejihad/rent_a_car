const User = require('../models/User');
const path = require('path');

// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, photo: user.photo, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (req.file?.path) updates.photo = '/uploads/' + path.basename(req.file.path);

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, photo: user.photo, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
