const express = require('express');
const router = express.Router();

// Importar controladores con SQLite
const providerController = require('../controllers/providerController-sqlite');
const userController = require('../controllers/userController-sqlite');
const productController = require('../controllers/productController-sqlite');
const saleController = require('../controllers/saleController-sqlite');
const saleDetailController = require('../controllers/saleDetailController-sqlite');

router.use('/providers', providerController);
router.use('/users', userController);
router.use('/products', productController);
router.use('/sales', saleController);
router.use('/sale-details', saleDetailController);

module.exports = router;
