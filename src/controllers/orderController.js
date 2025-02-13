const Order = require("../models/Order");
const Product = require("../models/Product");

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const validStatuses = ['pending', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user');

    await sendEmail(
      order.user.email,
      'Order Status Update',
      `Your order status has been updated to: ${status}`
    );

    res.json(order);
};


const createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.inventory < quantity) {
    return res.status(400).json({ message: 'Insufficient inventory' });
  }

  product.inventory -= quantity;
  await product.save();

  const order = new Order({ product: productId, quantity });
  await order.save();

  res.status(201).json(order);
};

  
  module.exports = { updateOrderStatus,createOrder };