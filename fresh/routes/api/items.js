const express = require('express');
const router = express.Router();
const itemsCtrl = require('../../controllers/api/items');

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items matching a queried name
 *     description: Retrieve a list of all items that match the specified name query.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the item to search for.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the item.
 *         name:
 *           type: string
 *           description: The name of the item.
 *         price:
 *           type: number
 *           description: The price of the item.
 *         description:
 *           type: string
 *           description: The description of the item.
 *         sku:
 *           type: string
 *           description: The SKU of the item.
 */
router.get('/items', itemsCtrl.getQueriedItems);

/**
 * @swagger
 * /user/{ id }:
 *   get:
 *     summary: View Information About a User
 *     description: Retrieve a list of information about the user, including name and address.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: The id of a user.
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               users:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: John Doe
 *               address: 123 Main St
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         address:
 *           type: string
 *           description: The address of the user.
 */
router.get('/user/:id', itemsCtrl.getUser);
router.get('/items/:id', itemsCtrl.getItemDetails);
router.get('/items/:id/reviews', itemsCtrl.getItemReviews);

module.exports = router;