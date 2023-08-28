const mongoose = require('mongoose')
const db = require('../../DB')
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    quizeCode: {
        type: String,
        require: true,
    },
    totalStudentAllowed: {
        type: String,
        require: true
    },
    questions: [
        {
            question: {
                type: String,
            },
            picture: {
                type: String,   // use multer here
            },
            option: {
                type: Array
            },
            answer: {
                type: Array
            },
            marks: {
                type: Number
            },
            multiAns: {
                type: Boolean
            }
        }
    ],
    isPublish: {
        type: Boolean,
        require: true,
    },
    qName: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const nested = db.quizer.model('questions', QuestionSchema);
nested.createIndexes();

module.exports = nested;
