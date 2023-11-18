import { initializeApp } from "firebase/app";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

const MIMETYPES = ["image/jpg", "image/png", "image/jpeg"];

const firebaseConfig = {
    apiKey: "AIzaSyD-D0vsd7oD4-YMzOEH8JfGODG-9w95CJc",
    authDomain: "ecomercemexx.firebaseapp.com",
    databaseURL: "https://ecomercemexx-default-rtdb.firebaseio.com/",
    projectId: "ecomercemexx",
    storageBucket: "ecomercemexx.appspot.com",
    messagingSenderId: "963775315846",
    appId: "1:963775315846:web:9546287b9da46d2b567607",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const storageRef = ref(storage);

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
    const { name, slug, description, price, category, stock, imageUrl } = req.body;
    const imgFiles = req.files;

    if (!imgFiles || imgFiles.length === 0) {
        return res.status(400).send("No se proporcionaron imágenes");
    }

    const imgURLs = [];
    for (const imgFile of imgFiles) {
        const imgExtension = extname(imgFile.originalname);
        const imgFileName = imgFile.originalname.split(imgExtension)[0];
        const imgFilePath = `uploads/${imgFileName}-${Date.now()}${imgExtension}`;
        const fileRef = ref(storage, imgFilePath);
        const snapshot = await uploadBytes(fileRef, imgFile.buffer);
        const imgURL = await getDownloadURL(snapshot.ref);
        imgURLs.push({ url: imgURL });
    }

    try {
        let product = new Product({
            name,
            slug,
            description,
            price,
            category,
            stock,
            imgs: imgURLs,
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

