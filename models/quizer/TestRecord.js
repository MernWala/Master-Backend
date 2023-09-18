const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const TestRecordSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    qSetid: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    qCode: {
        type: String,
        require: true
    },
    stuId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    record: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            answer: {
                type: Array,
                require: true
            },
            key :{
                type: Array,
                require: true
            },
            status: {
                type: Boolean,
                default: false
            },
            marks: {
                type: Number,
                require: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    scoredMarks: {
        type: Number,
        default: 0
    },
    isSubmited: {
        type: Boolean,
        require: true
    }
});

const record = db.quizer.model('test record', TestRecordSchema);
record.createIndexes();

module.exports = record;