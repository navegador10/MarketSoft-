const express = require('express');
const router = express.Router();

const providerRoutes = require('./providerRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const saleRoutes = require('./saleRoutes');
const saleDetailRoutes = require('./saleDetailRoutes');

router.use('/providers', providerRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/sale-details', saleDetailRoutes);

module.exports = router;
