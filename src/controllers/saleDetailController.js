const { SaleDetail, Sale, Product } = require('../models');

const saleDetailController = {
  // GET /api/sale-details
  async getAllSaleDetails(req, res) {
    try {
      const saleDetails = await SaleDetail.findAll({
        include: [
          { model: Sale, as: 'sale' },
          { model: Product, as: 'product' }
        ]
      });
      res.json(saleDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/sale-details/:id
  async getSaleDetailById(req, res) {
    try {
      const saleDetail = await SaleDetail.findByPk(req.params.id, {
        include: [
          { model: Sale, as: 'sale' },
          { model: Product, as: 'product' }
        ]
      });
      if (!saleDetail) {
        return res.status(404).json({ error: 'Sale detail not found' });
      }
      res.json(saleDetail);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/sale-details
  async createSaleDetail(req, res) {
    try {
      const saleDetail = await SaleDetail.create(req.body);
      const createdSaleDetail = await SaleDetail.findByPk(saleDetail.id, {
        include: [
          { model: Sale, as: 'sale' },
          { model: Product, as: 'product' }
        ]
      });
      res.status(201).json(createdSaleDetail);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // PUT /api/sale-details/:id
  async updateSaleDetail(req, res) {
    try {
      const saleDetail = await SaleDetail.findByPk(req.params.id);
      if (!saleDetail) {
        return res.status(404).json({ error: 'Sale detail not found' });
      }
      await saleDetail.update(req.body);
      const updatedSaleDetail = await SaleDetail.findByPk(saleDetail.id, {
        include: [
          { model: Sale, as: 'sale' },
          { model: Product, as: 'product' }
        ]
      });
      res.json(updatedSaleDetail);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // DELETE /api/sale-details/:id
  async deleteSaleDetail(req, res) {
    try {
      const saleDetail = await SaleDetail.findByPk(req.params.id);
      if (!saleDetail) {
        return res.status(404).json({ error: 'Sale detail not found' });
      }
      await saleDetail.destroy();
      res.json({ message: 'Sale detail deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = saleDetailController;
