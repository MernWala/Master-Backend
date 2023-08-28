const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const ReportBug = new Schema({
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
    },
    accountType: {
        type: String,
        default: 'Instructor'
    },
    report: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const bug = db.quizer.model('Reported Bugs', ReportBug);
bug.createIndexes();

module.exports = bug;