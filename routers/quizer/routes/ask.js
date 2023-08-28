const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const AskQuestion = require('../../../models/quizer/AskQuestion')

router.post('/question/', [

    body('emailId', "No email found").isEmail(),
    body('question', "No answer found").isLength({ min: 10 }),
    body('answerToMail', "Verification message not found").exists(),

], async (req, res) => {

    // validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { emailId, question, answerToMail } = req.body;

        const ask = await AskQuestion.create({
            "emailId": emailId,
            "question": question,
            "answerToMail": answerToMail
        });

        res.status(201).json({ ask })

    } catch (error) {
        res.status(500).json({ error })
    }
});

module.exports = router