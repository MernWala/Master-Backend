const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const ContactSchema = require('../../../models/conceptStudio/Contact')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const authenticate = require('../../../middleware/conceptStudio/authenticate.js');

router.post('/send', jsonParser, [

    body('name', "Name not found").exists(),
    body('email', "Email not found").exists(),
    body('mess', "Message not found").exists()

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, mess } = req.body

        await ContactSchema.create({
            name: name,
            email: email,
            mess: mess
        }).then((e) => {
            let data = e.toJSON();
            return res.status(201).json({ data })
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
});

router.get('/get', authenticate, async (req, res) => {
    try {

        await ContactSchema.find({}).then((data) => {
            return res.status(200).json({ data })
        })

    } catch (error) {
        return res.status(500).json({ status: 'Server Error' })
    }
});

module.exports = router