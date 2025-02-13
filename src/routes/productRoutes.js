const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const {getProducts,searchProducts} = require('../controllers/productController')
const router = express.Router();


router.get("/", getProducts)
router.get('/search', searchProducts);
// Create Product
router.post('/', authMiddleware, async (req, res) => {
  const { name, price, description } = req.body;
  const product = new Product({ name, price, description });
  await product.save();
  res.status(201).json(product);
});

// Get All Products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get Product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Update Product
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, price } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { name, price }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Delete Product
router.delete('/:id', authMiddleware, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;