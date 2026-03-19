const { Sale, User, SaleDetail, Product, Provider } = require('../models');
const { validate } = require('../middleware/validation');

class SaleController {
  // GET /api/sales
  async getAllSales(req, res) {
    try {
      const sales = await Sale.findAll({
        include: [
          { 
            model: User, 
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          { 
            model: SaleDetail, 
            as: 'saleDetails',
            include: [
              { 
                model: Product, 
                as: 'product',
                include: [
                  { model: Provider, as: 'provider', attributes: ['id', 'name'] }
                ]
              }
            ]
          }
        ],
        order: [['date', 'DESC']]
      });
      
      // Calculate total for each sale
      const salesWithTotals = sales.map(sale => {
        const total = sale.saleDetails.reduce((sum, detail) => {
          return sum + (detail.price * detail.quantity);
        }, 0);
        
        return {
          ...sale.toJSON(),
          calculatedTotal: total,
          itemCount: sale.saleDetails.length
        };
      });

      res.json({
        message: 'Sales retrieved successfully',
        data: salesWithTotals,
        count: salesWithTotals.length
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve sales'
      });
    }
  }

  // GET /api/sales/:id
  async getSaleById(req, res) {
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: [
          { 
            model: User, 
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          },
          { 
            model: SaleDetail, 
            as: 'saleDetails',
            include: [
              { 
                model: Product, 
                as: 'product',
                include: [
                  { model: Provider, as: 'provider', attributes: ['id', 'name', 'email'] }
                ]
              }
            ]
          }
        ]
      });

      if (!sale) {
        return res.status(404).json({ 
          error: 'Sale not found',
          message: `Sale with ID ${req.params.id} does not exist`
        });
      }

      // Calculate total
      const total = sale.saleDetails.reduce((sum, detail) => {
        return sum + (detail.price * detail.quantity);
      }, 0);

      res.json({
        message: 'Sale retrieved successfully',
        data: {
          ...sale.toJSON(),
          calculatedTotal: total,
          itemCount: sale.saleDetails.length
        }
      });
    } catch (error) {
      console.error('Error fetching sale:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve sale'
      });
    }
  }

  // POST /api/sales
  async createSale(req, res) {
    // Validate request body
    const { error } = validate('sale').validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { userId, saleDetails } = req.body;

    try {
      // Start transaction
      const result = await Sale.sequelize.transaction(async (t) => {
        // Validate user exists
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }

        // Validate all products and check stock
        const validatedProducts = [];
        let total = 0;

        for (const detail of saleDetails) {
          const product = await Product.findByPk(detail.productId, { 
            transaction: t,
            lock: t.LOCK.UPDATE
          });

          if (!product) {
            throw new Error(`Product with ID ${detail.productId} not found`);
          }

          if (product.stock < detail.quantity) {
            throw new Error(
              `Insufficient stock for product ${product.name}. ` +
              `Available: ${product.stock}, Requested: ${detail.quantity}`
            );
          }

          // Update stock
          await product.update(
            { stock: product.stock - detail.quantity },
            { transaction: t }
          );

          validatedProducts.push({
            productId: product.id,
            productName: product.name,
            quantity: detail.quantity,
            unitPrice: product.price,
            subtotal: product.price * detail.quantity
          });

          total += product.price * detail.quantity;
        }

        // Create sale
        const sale = await Sale.create({
          userId,
          total,
          date: new Date()
        }, { transaction: t });

        // Create sale details
        const createdDetails = await Promise.all(
          validatedProducts.map(async (validatedProduct) => {
            return await SaleDetail.create({
              saleId: sale.id,
              productId: validatedProduct.productId,
              quantity: validatedProduct.quantity,
              price: validatedProduct.unitPrice
            }, { transaction: t });
          })
        );

        return { sale, details: createdDetails, validatedProducts };
      });

      // Fetch complete sale with associations
      const completeSale = await Sale.findByPk(result.sale.id, {
        include: [
          { 
            model: User, 
            as: 'user',
            attributes: ['id', 'name', 'email', 'role']
          },
          { 
            model: SaleDetail, 
            as: 'saleDetails',
            include: [
              { 
                model: Product, 
                as: 'product',
                include: [
                  { model: Provider, as: 'provider', attributes: ['id', 'name'] }
                ]
              }
            ]
          }
        ]
      });

      res.status(201).json({
        message: 'Sale created successfully',
        data: {
          ...completeSale.toJSON(),
          calculatedTotal: total,
          itemCount: saleDetails.length,
          businessLogic: {
            stockUpdated: true,
            totalCalculated: true,
            transactionCompleted: true
          }
        }
      });

    } catch (error) {
      console.error('Error creating sale:', error);
      
      if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
        return res.status(400).json({
          error: 'Business logic error',
          message: error.message
        });
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create sale'
      });
    }
  }

  // PUT /api/sales/:id
  async updateSale(req, res) {
    try {
      const sale = await Sale.findByPk(req.params.id);
      
      if (!sale) {
        return res.status(404).json({ 
          error: 'Sale not found',
          message: `Sale with ID ${req.params.id} does not exist`
        });
      }

      // Only allow updating certain fields
      const allowedUpdates = ['userId'];
      const updates = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      await sale.update(updates);

      res.json({
        message: 'Sale updated successfully',
        data: sale
      });

    } catch (error) {
      console.error('Error updating sale:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to update sale'
      });
    }
  }

  // DELETE /api/sales/:id
  async deleteSale(req, res) {
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: [{ 
          model: SaleDetail, 
          as: 'saleDetails' 
        }]
      });

      if (!sale) {
        return res.status(404).json({ 
          error: 'Sale not found',
          message: `Sale with ID ${req.params.id} does not exist`
        });
      }

      // Start transaction to restore stock
      await Sale.sequelize.transaction(async (t) => {
        // Restore stock for each product
        for (const detail of sale.saleDetails) {
          const product = await Product.findByPk(detail.productId, { 
            transaction: t,
            lock: t.LOCK.UPDATE
          });

          if (product) {
            await product.update(
              { stock: product.stock + detail.quantity },
              { transaction: t }
            );
          }
        }

        // Delete sale details first (foreign key constraint)
        await SaleDetail.destroy({ 
          where: { saleId: sale.id },
          transaction: t 
        });

        // Delete sale
        await sale.destroy({ transaction: t });
      });

      res.json({
        message: 'Sale deleted successfully',
        data: {
          id: sale.id,
          stockRestored: true,
          itemsDeleted: sale.saleDetails.length
        }
      });

    } catch (error) {
      console.error('Error deleting sale:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to delete sale'
      });
    }
  }

  // GET /api/sales/stats
  async getSalesStats(req, res) {
    try {
      const stats = await Sale.findAll({
        attributes: [
          [Sale.sequelize.fn('COUNT', Sale.sequelize.col('id')), 'totalSales'],
          [Sale.sequelize.fn('SUM', Sale.sequelize.col('total')), 'totalRevenue'],
          [Sale.sequelize.fn('AVG', Sale.sequelize.col('total')), 'averageSale']
        ],
        raw: true
      });

      const salesByMonth = await Sale.findAll({
        attributes: [
          [Sale.sequelize.fn('DATE_TRUNC', 'month', Sale.sequelize.col('date')), 'month'],
          [Sale.sequelize.fn('COUNT', Sale.sequelize.col('id')), 'salesCount'],
          [Sale.sequelize.fn('SUM', Sale.sequelize.col('total')), 'revenue']
        ],
        group: [Sale.sequelize.fn('DATE_TRUNC', 'month', Sale.sequelize.col('date'))],
        order: [[Sale.sequelize.fn('DATE_TRUNC', 'month', Sale.sequelize.col('date')), 'DESC']],
        limit: 12,
        raw: true
      });

      res.json({
        message: 'Sales statistics retrieved successfully',
        data: {
          overall: stats[0],
          monthly: salesByMonth
        }
      });

    } catch (error) {
      console.error('Error fetching sales stats:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve sales statistics'
      });
    }
  }
}

module.exports = new SaleController();
