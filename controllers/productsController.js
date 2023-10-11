const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.createProduct = async (req, res) => {
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
};

exports.updateProduct = async (req, res) => {
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
};

exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

