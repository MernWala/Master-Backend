const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_Secret = process.env.GLOBAL_JWT_KEY
const User = require('../../../models/keepPlus/User')
const fetchuser = require('../../../middleware/keepPlus/fetchuser');

const router = express.Router();

// ROUT 1 : create a user using POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', "Enter valid name").isLength({ min: 3 }),
    body('email', "Enter valid mail Id").isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, user with this email already exists" })
        }

        let salt = bcrypt.genSaltSync(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        // creating users
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authTocken = jwt.sign(data, 'shhhhh');

        // send response that this user is created
        res.json({ authTocken });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }

});

// ROUT 2 : Login / Authenticate a user using POST -> /api/auth/login. No login require
router.post('/login', [
    body('email', "Enter valid mail Id").isEmail(),
    body('password', "Password can't be blank").exists(),

], async (req, res) => {

    // if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Userid or Password !" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Userid or Password !" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authTocken = jwt.sign(data, JWT_Secret);
        res.json({ authTocken });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

// ROUT 3 : Get loggedin User data using POST -> /api/auth/getData. Login Require
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router;