const express = require('express');
const router = express.Router();
const Instructor = require('../../../models/quizer/Instructor');
const Student = require('../../../models/quizer/Student');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ROUT 1 - Login Instructor endpoint
router.post('/inst', [
    body('email', "Invalied email address").isEmail(),
    body('password', "First enter your password").exists(),

], async (req, res) => {

    // if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const inst = await Instructor.findOne({ email });
        if (!inst) {
            return res.status(400).json({ error: "Invalid Userid or Pass word !" });
        }

        const passwordCompare = await bcrypt.compare(password, inst.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Userid or Password !" });
        }

        const data = {
            user: {
                id: inst.id
            }
        }
        const authTocken = jwt.sign(data, process.env.GLOBAL_JWT_KEY);
        res.json({ authTocken });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

// ROUTE 2 - Login Student endpoint
router.post('/stu', [
    body('email', "Invalied email address").isEmail(),
    body('password', "First enter your password").exists(),

], async (req, res) => {

    // if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const stu = await Student.findOne({ email });
        if (!stu) {
            return res.status(400).json({ error: "Invalid Userid or Pass word !" });
        }

        const passwordCompare = await bcrypt.compare(password, stu.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Userid or Password !" });
        }

        const data = {
            user: {
                id: stu.id
            }
        }
        const authTocken = jwt.sign(data, process.env.GLOBAL_JWT_KEY);
        res.json({ authTocken });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router;