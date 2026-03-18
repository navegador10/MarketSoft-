const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the sale
 *         userId:
 *           type: integer
 *           description: The id of the user who made the sale
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the sale
 *         total:
 *           type: number
 *           description: The total amount of the sale (calculated automatically)
 *         user:
 *           $ref: '#/components/schemas/User'
 *         saleDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleDetail'
 *     CreateSaleRequest:
 *       type: object
 *       required:
 *         - userId
 *         - saleDetails
 *       properties:
 *         userId:
 *           type: integer
 *           description: The id of the user who made the sale
 *         saleDetails:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The id of the product
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: The quantity of the product
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Returns the list of all sales
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: The list of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 */
router.get('/', saleController.getAllSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get a sale by id
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale id
 *     responses:
 *       200:
 *         description: The sale description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 */
router.get('/:id', saleController.getSaleById);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleRequest'
 *     responses:
 *       201:
 *         description: The sale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Bad request
 */
router.post('/', saleController.createSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update a sale by id
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: The sale was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', saleController.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale by id
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The sale id
 *     responses:
 *       200:
 *         description: The sale was successfully deleted
 *       404:
 *         description: Sale not found
 */
router.delete('/:id', saleController.deleteSale);

module.exports = router;
