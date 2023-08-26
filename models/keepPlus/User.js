const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const user = db.keepPlus.model('user', UserSchema);
user.createIndexes();

module.exports = user;