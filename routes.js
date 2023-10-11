const express = require('express');
const router = express.Router();
const User = require('./User');
const Product = require('./Product');

// GET: Retorna la lista de todos los usuarios
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET: Retorna un usuario específico por su ID
router.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST: Crea un nuevo usuario
router.post('/api/users', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = new User({
            email,
            password
        });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT: Actualiza un usuario existente por su ID
router.put('/api/users/:id', async (req, res) => {
    const { email, password } = req.body;

    const userFields = {};
    if (email) userFields.email = email;
    if (password) userFields.password = password;

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE: Elimina un usuario por su ID
router.delete('/api/users/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await User.findByIdAndRemove(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});




// GET: Retorna la lista de todos los productos
router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET: Retorna un producto específico por su ID
router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST: Crea un nuevo producto
router.post('/api/products', async (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;

    try {
        let product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT: Actualiza un producto existente por su ID
router.put('/api/products/:id', async (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;

    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (category) productFields.category = category;
    if (stock) productFields.stock = stock;
    if (imageUrl) productFields.imageUrl = imageUrl;

    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE: Elimina un producto por su ID
router.delete('/api/product/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});



module.exports = router;
