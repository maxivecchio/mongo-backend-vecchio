const express = require('express');
const {
    getAllProducts,
    getProductById,
    getProductByUserId,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getProductsByUserHandle
} = require('../controllers/productsController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);
router.get('/user/:userId', getProductByUserId);
router.get('/userhandle/:username', getProductsByUserHandle);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;