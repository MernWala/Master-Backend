const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    mess: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const contact = db.conceptStudio.model('contact', ContactSchema);
contact.createIndexes();

module.exports = contact;