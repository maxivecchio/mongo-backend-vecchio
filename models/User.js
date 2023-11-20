const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayname: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    isBusiness: {
        type: Boolean,
        required: true,
    },
    businessContact: {
        type: String,
        required: false,
    },
    businessAddress: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('User', UserSchema);
