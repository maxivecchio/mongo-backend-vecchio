const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('./middleware/auth');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const JWT_SECRET = "ClaveSecreta";

router.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error '+ err);
    }
});

// GET: Retorna la lista de todos los usuarios
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// GET: Retorna un usuario específico por su ID
router.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// POST: Crea un nuevo usuario
router.post('/api/users', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password: bcrypt.hashSync(password, 10)
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('JWT_SECRET'), { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server Error '+ err);
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
        res.status(500).send('Server Error ' + err);
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
        res.status(500).send('Server Error ' + err);
    }
});

// GET: Retorna la lista de todos los productos
router.get('/api/products', auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// GET: Retorna un producto específico por su ID
router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
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
        res.status(500).send('Server Error ' + err);
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
        res.status(500).send('Server Error ' + err);
    }
});

// DELETE: Elimina un producto por su ID
router.delete('/api/products/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

const Category = require('./Category'); // Asegúrate de tener este modelo definido

// ... (resto de las rutas para User y Product)

// GET: Retorna la lista de todas las categorías
router.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// GET: Retorna una categoría específica por su ID
router.get('/api/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// POST: Crea una nueva categoría
router.post('/api/categories', async (req, res) => {
    const { name, description } = req.body;

    try {
        let category = new Category({
            name,
            description
        });

        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// PUT: Actualiza una categoría existente por su ID
router.put('/api/categories/:id', async (req, res) => {
    const { name, description } = req.body;

    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;

    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: categoryFields },
            { new: true }
        );

        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

// DELETE: Elimina una categoría por su ID
router.delete('/api/categories/:id', async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        await Category.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

router.get('/api/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('products.product');
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
});

router.post('/api/cart/:userId', async (req, res) => {
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
});

router.delete('/api/cart/:userId/:productId', async (req, res) => {
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
});


module.exports = router;
