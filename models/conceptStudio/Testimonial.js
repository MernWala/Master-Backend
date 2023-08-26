const mongoose = require('mongoose');
const db = require('../../DB')
const { Schema } = mongoose;

const TestimonialSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    degi: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    mess: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const testimonial = db.conceptStudio.model('testimonial', TestimonialSchema);
testimonial.createIndexes();

module.exports = testimonial;