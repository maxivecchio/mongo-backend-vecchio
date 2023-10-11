const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.createCategory = async (req, res) => {
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
};

exports.updateCategory = async (req, res) => {
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
};

exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        await Category.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};
