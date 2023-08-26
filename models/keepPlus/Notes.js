const mongoose = require("mongoose");
const db = require('../../DB')
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        reuired: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = db.keepPlus.model('notes', NotesSchema);