const getAnalytics = async (req, res) => {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
  
    const popularProducts = await Order.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
  
    res.json({ totalSales, popularProducts });
  };
  
  module.exports = { getAnalytics };