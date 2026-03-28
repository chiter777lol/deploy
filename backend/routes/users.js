const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Нельзя редактировать чужой профиль' });
    }
    const { password, role, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
