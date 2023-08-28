const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const StudentSchema = new Schema({
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
        default: 'Student'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const stu = db.quizer.model('student', StudentSchema);
stu.createIndexes();

module.exports = stu;