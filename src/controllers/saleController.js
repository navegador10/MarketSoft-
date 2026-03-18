const { Sale, User, SaleDetail, Product } = require('../models');
const { sequelize } = require('../config/database');

const saleController = {
  // GET /api/sales
  async getAllSales(req, res) {
    try {
      const sales = await Sale.findAll({
        include: [
          { model: User, as: 'user' },
          { model: SaleDetail, as: 'saleDetails', include: [{ model: Product, as: 'product' }] }
        ]
      });
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/sales/:id
  async getSaleById(req, res) {
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user' },
          { model: SaleDetail, as: 'saleDetails', include: [{ model: Product, as: 'product' }] }
        ]
      });
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/sales
  async createSale(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { userId, saleDetails } = req.body;
      
      // Calculate total
      let total = 0;
      for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.productId, { transaction });
        if (!product) {
          await transaction.rollback();
          return res.status(400).json({ error: `Product with ID ${detail.productId} not found` });
        }
        if (product.stock < detail.quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        }
        total += product.price * detail.quantity;
      }

      // Create sale
      const sale = await Sale.create({
        userId,
        total,
        date: new Date()
      }, { transaction });

      // Create sale details and update stock
      for (const detail of saleDetails) {
        const product = await Product.findByPk(detail.productId, { transaction });
        
        await SaleDetail.create({
          saleId: sale.id,
          productId: detail.productId,
          quantity: detail.quantity,
          price: product.price
        }, { transaction });

        // Update product stock
        await product.update({
          stock: product.stock - detail.quantity
        }, { transaction });
      }

      await transaction.commit();

      // Return complete sale with details
      const completeSale = await Sale.findByPk(sale.id, {
        include: [
          { model: User, as: 'user' },
          { model: SaleDetail, as: 'saleDetails', include: [{ model: Product, as: 'product' }] }
        ]
      });

      res.status(201).json(completeSale);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  },

  // PUT /api/sales/:id
  async updateSale(req, res) {
    try {
      const sale = await Sale.findByPk(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      await sale.update(req.body);
      res.json(sale);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // DELETE /api/sales/:id
  async deleteSale(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: [{ model: SaleDetail, as: 'saleDetails' }],
        transaction
      });
      
      if (!sale) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Restore stock for each product in the sale
      for (const detail of sale.saleDetails) {
        const product = await Product.findByPk(detail.productId, { transaction });
        await product.update({
          stock: product.stock + detail.quantity
        }, { transaction });
      }

      // Delete sale details and sale
      await SaleDetail.destroy({ where: { saleId: sale.id }, transaction });
      await sale.destroy({ transaction });

      await transaction.commit();
      res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = saleController;
