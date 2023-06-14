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
 * /items/{ id }:
 *   get:
 *     summary: View Information About a Item
 *     description: Retrieve a list of information about the item.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: The id of an item.
 *         required: true
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
router.get('/items/:id', itemsCtrl.getItemDetails);

/**
 * @swagger
 * /items/{ id }/reviews:
 *   get:
 *     summary: View Reviews of an Item
 *     description: Retrieve all reviews about a specific item.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: The id of an item.
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the review.
 *         content:
 *           type: string
 *           description: The content of the item.
 *         rating:
 *           type: integer
 *           description: The price of the item.
 *         item_id:
 *           type: integer
 *           description: The id of the corresponding item.
 *         user_id:
 *           type: integer
 *           description: The id of the corresponding user.
 */
router.get('/items/:id/reviews', itemsCtrl.getItemReviews);

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
 *               items:
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

module.exports = router;