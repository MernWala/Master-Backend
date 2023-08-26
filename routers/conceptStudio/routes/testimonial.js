const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const TestimonialSchema = require('../../../models/conceptStudio/Testimonial')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const authenticate = require('../../../middleware/conceptStudio/authenticate');
const cors = require('cors')

router.use(cors());

// Middleware for handling preflight OPTIONS request
router.options('/get', (req, res) => {
    // Set CORS headers for preflight request
    const allowedOrigins = [
        'http://192.168.1.16:3000 ',
        'https://sk12345678.000webhostapp.com/'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Custom-Header');
    }
    // Respond to the preflight request
    res.status(204).send();
});

// Send data to DB
router.post('/send', jsonParser, [

    body('name', "Not a valid name").isLength({ min: 3 }),
    body('email', "Is'nt a valid email").isEmail(),
    body('degi', 'Designation not found'),
    body('rating', "Rating not found").exists(),
    body('mess', "Not a valid message").isLength({ min: 5 })

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, mess, degi, rating } = req.body

        await TestimonialSchema.create({
            name: name,
            email: email,
            degi: degi,
            rating: rating,
            mess: mess
        }).then((e) => {
            let data = e.toJSON();
            return res.status(201).json({ data })
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
});

// Activete review || Login require
router.put('/set/true/:id', authenticate, async (req, res) => {
    try {
        await TestimonialSchema.findByIdAndUpdate
            (
                { _id: req.params.id },
                { status: true }
            ).then((e) => {
                let data = e.toJSON();
                return res.status(200).json({ data })
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
});

// Deactivate review || Login require
router.put('/set/false/:id', authenticate, async (req, res) => {
    try {
        await TestimonialSchema.findByIdAndUpdate
            (
                { _id: req.params.id },
                { status: false }
            ).then((e) => {
                let data = e.toJSON();
                return res.status(200).json({ data })
            }).catch(() => {
                return res.status(400).json({ status: 'Invalid ID' })
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
});

// get all data with status -> true
router.get('/get/', async (req, res) => {
    try {
        await TestimonialSchema.find({
            status: true
        }).then(async (data) => {
            return res.status(200).json({ data })
        })
    } catch (error) {
        return res.status(500).json({ status: 'Server error' })
    }
})

// get all data with no constraint || Login require
router.get('/get/all', authenticate, async (req, res) => {
    try {
        await TestimonialSchema.find({}).then(async (data) => {
            return res.status(200).json({ data })
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 'Server Error' })
    }
})

module.exports = router