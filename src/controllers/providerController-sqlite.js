const { Provider } = require('../models-sqlite');

const router = require('express').Router();

// GET /api/providers
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.findAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/providers/:id
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/providers
router.post('/', async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/providers/:id
router.put('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    await provider.update(req.body);
    res.json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/providers/:id
router.delete('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    await provider.destroy();
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
