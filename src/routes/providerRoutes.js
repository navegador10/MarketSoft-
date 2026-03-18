const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - email
 *         - city
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the provider
 *         name:
 *           type: string
 *           description: The provider name
 *         phone:
 *           type: string
 *           description: The provider phone number
 *         email:
 *           type: string
 *           format: email
 *           description: The provider email
 *         city:
 *           type: string
 *           description: The provider city
 */

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Returns the list of all providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: The list of providers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 */
router.get('/', providerController.getAllProviders);

/**
 * @swagger
 * /api/providers/{id}:
 *   get:
 *     summary: Get a provider by id
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The provider id
 *     responses:
 *       200:
 *         description: The provider description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found
 */
router.get('/:id', providerController.getProviderById);

/**
 * @swagger
 * /api/providers:
 *   post:
 *     summary: Create a new provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       201:
 *         description: The provider was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       400:
 *         description: Bad request
 */
router.post('/', providerController.createProvider);

/**
 * @swagger
 * /api/providers/{id}:
 *   put:
 *     summary: Update a provider by id
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The provider id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       200:
 *         description: The provider was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', providerController.updateProvider);

/**
 * @swagger
 * /api/providers/{id}:
 *   delete:
 *     summary: Delete a provider by id
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The provider id
 *     responses:
 *       200:
 *         description: The provider was successfully deleted
 *       404:
 *         description: Provider not found
 */
router.delete('/:id', providerController.deleteProvider);

module.exports = router;
