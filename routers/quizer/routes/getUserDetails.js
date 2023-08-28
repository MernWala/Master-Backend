const express = require('express');
const router = express.Router();
const fetchuser = require('../../../middleware/quizer/fetchuser');
const Instructor = require('../../../models/quizer/Instructor');
const Student = require('../../../models/quizer/Student');

// ROUTE 1 - Get details of instructor endpoint
router.post('/inst', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Instructor.findById(userId, 'fName lName email verified picture accountType');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// ROUTE 1 - Get details of student endpoint
router.post('/stu', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Student.findById(userId, 'fName lName email verified picture accountType');
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router