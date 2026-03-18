const express = require('express');
const router = express.Router();
const saleDetailController = require('../controllers/saleDetailController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleDetail:
 *       type: object
 *       required:
 *         - saleId
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the sale detail
 *         saleId:
 *           type: integer
 *           description: The id of the sale
 *         productId:
 *           type: integer
 *           description: The id of the product
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: The quantity of the product
 *         price:
 *           type: number
 *           minimum: 0.01
 *           description: The price of the product
 *         sale:
 *           $ref: '#/components/schemas/Sale'
 *         product:
 *           $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/sale-details:
 *   get:
 *     summary: Returns the list of all sale details
 *     tags: [Sale Details]
 *     responses:
 *       200:
 *         description: The list of sale details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleDetail'
 */
router.get('/', saleDetailController.getAllSaleDetails);

/**
 * @swagger
 * /api/sale-details/{id}:
 *   get:
 *     summary: Get a sale detail by id
 *     tags: [Sale Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale detail id
 *     responses:
 *       200:
 *         description: The sale detail description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetail'
 *       404:
 *         description: Sale detail not found
 */
router.get('/:id', saleDetailController.getSaleDetailById);

/**
 * @swagger
 * /api/sale-details:
 *   post:
 *     summary: Create a new sale detail
 *     tags: [Sale Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleDetail'
 *     responses:
 *       201:
 *         description: The sale detail was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetail'
 *       400:
 *         description: Bad request
 */
router.post('/', saleDetailController.createSaleDetail);

/**
 * @swagger
 * /api/sale-details/{id}:
 *   put:
 *     summary: Update a sale detail by id
 *     tags: [Sale Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale detail id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleDetail'
 *     responses:
 *       200:
 *         description: The sale detail was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetail'
 *       404:
 *         description: Sale detail not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', saleDetailController.updateSaleDetail);

/**
 * @swagger
 * /api/sale-details/{id}:
 *   delete:
 *     summary: Delete a sale detail by id
 *     tags: [Sale Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale detail id
 *     responses:
 *       200:
 *         description: The sale detail was successfully deleted
 *       404:
 *         description: Sale detail not found
 */
router.delete('/:id', saleDetailController.deleteSaleDetail);

module.exports = router;
