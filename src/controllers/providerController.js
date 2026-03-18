const { Provider } = require('../models');

const providerController = {
  // GET /api/providers
  async getAllProviders(req, res) {
    try {
      const providers = await Provider.findAll();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/providers/:id
  async getProviderById(req, res) {
    try {
      const provider = await Provider.findByPk(req.params.id);
      if (!provider) {
        return res.status(404).json({ error: 'Provider not found' });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/providers
  async createProvider(req, res) {
    try {
      const provider = await Provider.create(req.body);
      res.status(201).json(provider);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // PUT /api/providers/:id
  async updateProvider(req, res) {
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
  },

  // DELETE /api/providers/:id
  async deleteProvider(req, res) {
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
  }
};

module.exports = providerController;
