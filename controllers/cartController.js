const Cart = require('../models/Cart');

exports.getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('products.product');
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new Cart({ user: req.params.userId });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.calculateTotalAmount();
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.productId);
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            await cart.calculateTotalAmount();
            res.json(cart);
        } else {
            res.status(404).json({ msg: 'Product not found in cart' });
        }
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        
        cart.products = [];
        
        await cart.calculateTotalAmount();
        
        await cart.save();

        res.json({ msg: 'Cart emptied successfully' });
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};