const express = require('express');
const {
    getCartByUserId,
    addToCart,
    removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', getCartByUserId);
router.post('/:userId', addToCart);
router.delete('/:userId/:productId', removeFromCart);

module.exports = router;