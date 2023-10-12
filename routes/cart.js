const express = require('express');
const {
    getCartByUserId,
    addToCart,
    emptyCart,
    removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', getCartByUserId);
router.post('/:userId', addToCart);
router.post('/:userId/empty', emptyCart);
router.delete('/:userId/:productId', removeFromCart);

module.exports = router;