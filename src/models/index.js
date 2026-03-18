const sequelize = require('../config/database');
const Provider = require('./Provider');
const User = require('./User');
const Product = require('./Product');
const Sale = require('./Sale');
const SaleDetail = require('./SaleDetail');

// Define relationships
Provider.hasMany(Product, { foreignKey: 'providerId', as: 'products' });
Product.belongsTo(Provider, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Sale.hasMany(SaleDetail, { foreignKey: 'saleId', as: 'saleDetails' });
SaleDetail.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });

Product.hasMany(SaleDetail, { foreignKey: 'productId', as: 'saleDetails' });
SaleDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

const db = {
  sequelize,
  Provider,
  User,
  Product,
  Sale,
  SaleDetail
};

module.exports = db;
