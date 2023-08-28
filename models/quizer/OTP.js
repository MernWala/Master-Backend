const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const otp = db.quizer.model('OTP verifier', OTPSchema);
otp.createIndexes();

module.exports = otp;