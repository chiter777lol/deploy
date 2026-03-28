const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    } else if (req.query.userId) {
      query.userId = req.query.userId;
    }
    const orders = await Order.find(query);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.id });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
