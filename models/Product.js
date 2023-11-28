const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    stock: {
        type: Number,
        default: 0
    },
    imgs: [{ url: String }],
}, { timestamps: true });

ProductSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug: slug });
};

ProductSchema.statics.findByUserSlug = function (slug) {
    return this.find({ slug: slug });
};

module.exports = mongoose.model('Product', ProductSchema);
