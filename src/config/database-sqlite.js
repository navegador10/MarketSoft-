const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar SQLite para pruebas sin necesidad de PostgreSQL
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

module.exports = sequelize;
