const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Place Order
router.post('/', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const order = new Order({
    user: req.userId,
    product: productId,
    quantity,
    totalPrice: product.price * quantity,
  });

  await order.save();
  res.status(201).json(order);
});

// Get User Orders
router.get('/', authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).populate('product');
  res.json(orders);
});

module.exports = router;