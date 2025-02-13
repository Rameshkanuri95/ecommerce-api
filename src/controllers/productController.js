const Product = require('../models/Product')
const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
  
    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  };
  
  const searchProducts = async (req, res) => {
    const { name, minPrice, maxPrice, category } = req.query;
    const query = {};
  
    if (name) query.name = { $regex: name, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (category) query.category = category;
  
    const products = await Product.find(query);
    res.json(products);
  };

  const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
  
    const product = await Product.findByIdAndUpdate(
      id,
      { $push: { reviews: { rating, comment } } },
      { new: true }
    );
  
    const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRatings / product.reviews.length;
    await product.save();
  
    res.json(product);
  };
  
  module.exports = { getProducts, searchProducts, addReview };
  
