const { initializeApp } = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} = require("firebase/storage");

const MIMETYPES = ["image/jpg", "image/png", "image/jpeg"];

const firebaseConfig = {
    apiKey: "AIzaSyCVy_2wkZqDXRZyDm6jPBwqcXz5WjYy28g",
    authDomain: "moveup-marketplace.firebaseapp.com",
    projectId: "moveup-marketplace",
    storageBucket: "moveup-marketplace.appspot.com",
    messagingSenderId: "430836231346",
    appId: "1:430836231346:web:808fd209694442f0f52dab"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const storageRef = ref(storage);
const multer = require('multer');

const storageMiddleware = multer.memoryStorage();

const multerUpload = multer({
    storage: storageMiddleware,
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${MIMETYPES.join(", ")} mimetypes are allowed`));
        }
    },
    limits: {
        fileSize: 10000000,
    },
});

const Product = require('../models/Product');
const User = require("../models/User");

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

exports.getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        console.log(slug)
        const product = await Product.findBySlug(slug);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.getProductByUserId = async (req, res) => {
    try {
        const products = await Product.find({ user_id: req.params.userId });
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.getProductsByUserHandle = async (req, res) => {
    try {
        const user = await User.findByUsername(req.params.username);
        const products = await Product.find({ user_id: user._id });
        res.json({ user: user, products: products });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createProduct = async (req, res) => {
    const { name, slug, description, price, stock, user_id } = req.body;
    /* const imgFiles = req.files;

    if (!imgFiles || imgFiles.length === 0) {
        return res.status(400).send("No se proporcionaron imágenes");
    } */

    /* const imgURLs = [];
    for (const imgFile of imgFiles) {
        const imgExtension = extname(imgFile.originalname);
        const imgFileName = imgFile.originalname.split(imgExtension)[0];
        const imgFilePath = `uploads/${imgFileName}-${Date.now()}${imgExtension}`;
        const fileRef = ref(storage, imgFilePath);
        const snapshot = await uploadBytes(fileRef, imgFile.buffer);
        const imgURL = await getDownloadURL(snapshot.ref);
        imgURLs.push({ url: imgURL });
    } */
    console.log(user_id)

    try {
        let product = new Product({
            user_id,
            name,
            slug,
            description,
            price,
            /* category, */
            stock,
            /* imgs: imgURLs, */
        });

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error ' + err);
    }
};

exports.updateProduct = async (req, res) => {
    const { name, slug, description, price, category, stock, imageUrl } = req.body;

    const productFields = {};
    if (name) productFields.name = name;
    if (slug) productFields.slug = slug;
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