const express = require('express');
const router = express.Router();
const itemsCtrl = require('../../controllers/api/items');

router.get('/', itemsCtrl.getQueriedItems);
router.get('/:id', itemsCtrl.getItemDetails);
router.get('/:id/reviews', itemsCtrl.getItemReviews);

module.exports = router;