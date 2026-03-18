const { Product, Provider } = require('../models-sqlite');
const router = require('express').Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Provider, as: 'provider' }]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Provider, as: 'provider' }]
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const productWithProvider = await Product.findByPk(product.id, {
      include: [{ model: Provider, as: 'provider' }]
    });
    res.status(201).json(productWithProvider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{ model: Provider, as: 'provider' }]
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
