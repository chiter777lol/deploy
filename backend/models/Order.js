const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: { 
    type: String, 
    enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'new'
  },
  paymentMethod: String,
  deliveryMethod: String,
  address: String,
  city: String,
  postalCode: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
