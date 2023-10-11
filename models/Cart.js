const mongoose = require('mongoose');
const Product = require('./Product');

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

CartSchema.methods.calculateTotalAmount = async function() {
    let total = 0;
    for (let item of this.products) {
        const product = await Product.findById(item.product);
        total += product.price * item.quantity;
    }
    this.totalAmount = total;
    await this.save();
};


module.exports = mongoose.model('Cart', CartSchema);
