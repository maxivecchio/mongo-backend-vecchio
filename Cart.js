const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number
    }
});

module.exports = mongoose.model('Cart', CartSchema);
