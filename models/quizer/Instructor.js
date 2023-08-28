const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const InstructorSchema = new Schema({
    fName: {
        type: String,
        require: true
    },
    lName: {
        type: String,
        require: true
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
    verified: {
        type: Boolean,
        require: true,
        default: false
    },
    picture: {
        type: String,
    },
    accountType: {
        type: String,
        default: 'Instructor'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const inst = db.quizer.model('instructor', InstructorSchema);
inst.createIndexes();

module.exports = inst;