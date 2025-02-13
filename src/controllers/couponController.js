const Coupon = require("../models/Coupon")

const applyCoupon = async (req, res) => {
    const { couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode });
  
    if (!coupon || coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
  
    const order = await Order.findById(req.orderId);
    order.totalPrice -= order.totalPrice * (coupon.discount / 100);
    await order.save();
  
    res.json(order);
};
  
module.exports = { applyCoupon };