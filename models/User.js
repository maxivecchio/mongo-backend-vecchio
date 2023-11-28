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
    isBusiness: {
        type: Boolean,
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
    businessContact: {
        type: String,
        required: false,
    },
    businessAddress: {
        type: String,
        required: false,
    }
});

UserSchema.statics.findByUsername = function (username) {
    return this.findOne({ username: username });
};

module.exports = mongoose.model('User', UserSchema);
