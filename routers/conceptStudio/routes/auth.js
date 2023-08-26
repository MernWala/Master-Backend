const JwtSecret = process.env.GLOBAL_JWT_KEY;
const LoginID = process.env.CONCEPT_ADMIN_ID;
const LoginKey = process.env.CONCEPT_ADMIN_KEY
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const jsonParser = bodyParser.json()

router.post('/login', jsonParser, [

    body('LoginID', "Login id not found").exists(),
    body('LoginKey', "Password not found").exists(),

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (LoginID === req.body.LoginID && LoginKey === req.body.LoginKey) {
            
            let data = {
                LoginID: LoginID,
                LoginKey: LoginKey
            }

            const token = jwt.sign(data, JwtSecret);
            return res.status(200).json({ token })

        } else {
            return res.status(400).json({ status: 'Invalid Credential' })
        }

    } catch (error) {
        return res.status(500).json({ error })
    }
})

module.exports = router