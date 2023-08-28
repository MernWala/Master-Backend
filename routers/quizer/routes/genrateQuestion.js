const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Question = require('../../../models/quizer/Question');
const fetchuser = require('../../../middleware/quizer/fetchuser')

// method to remove perticular question
const removeQuestion = (arr, _id) => {
    const index = arr.findIndex((ele) => {
        return ele._id.toString() === _id
    });

    arr[index] = null
    let newArr = [];

    arr.forEach((ele) => {
        if (ele !== null) {
            newArr.push(ele)
        }
    });

    return (index === -1) ? -1 : newArr;
}

// method to get index of perticular question
const getIndex = (arr, _id) => {
    return arr.findIndex((ele) => {
        return ele._id.toString() === _id
    });
}

// ROUTE 1 - Genrate question endpoint
router.post('/generate/:id', async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return
    }

    try {

        let quize = await Question.findOne({ quizeCode: req.body.quizeCode });
        if (quize) {
            res.status(400).json({
                error: 'This exam code already exits.',
                resolution: 'Try again to proceed'
            });
            return;
        }

        quize = await Question.create({
            user: req.params.id,
            quizeCode: req.body.quizeCode,
            totalStudentAllowed: req.body.totalStudentAllowed,
            questions: [],
            isPublish: req.body.isPublish,
        });

        const data = {
            user: {
                id: quize.id
            }
        }

        res.status(201).json({ status: 'success' })

    } catch (error) {
        res.status(500).json({ error })
    }
});

// ROUTE 2 - Add new question endpoint
router.put('/add-question/', [

    body('quizeCode', "examCode not found").exists(),
    body('question', "Length of question must be at least 25 character long").isLength({ min: 25 }),
    body('option', "Options not found").exists(),
    body('answer', "Answer not found").exists(),
    body('marks', "Please value some marks for the question").exists(),
    body('multiAns', "Multiple ans value not found").exists(),

], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return;
    }

    try {
        const qSet = {
            question: req.body.question,
            option: req.body.option,
            answer: req.body.answer,
            picture: req.body.picture ? req.body.picture : '',
            marks: req.body.marks,
            multiAns: req.body.multiAns,
        }

        let ques = await Question.findOne({ quizeCode: req.body.quizeCode });
        if (!ques) {
            res.status(400).json({ error: `Data with ${req.body.quizeCode} exam code not found. Please regenrate quize code` })
            return;
        } else {
            ques.questions.push(qSet)
        }

        const sent = await Question.findByIdAndUpdate(ques._id, { $set: ques }, { new: true })
        res.status(200).json({ sent })

    } catch (error) {
        res.status(500).json({ error })
        return;
    }
});

// ROUTE 3 - Delete question endpoint
router.delete('/delete-question/:mainId/:questionId', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const qSetId = req.params.mainId;
        const qId = req.params.questionId;

        let ques = await Question.findOne({ _id: qSetId, user: userId });
        if (!ques) {
            res.status(400).json({ error: `Data with ${req.params.mainId} exam code not found` })
            return;
        }

        const newArr = removeQuestion(ques.questions, qId);
        if (newArr < 0) {
            res.status(400).json({ error: "Not found" });
            return;
        }
        ques.questions = newArr;

        await Question.findByIdAndUpdate(req.params.mainId, { $set: ques }, { new: false })
        res.status(200).json({ updated: newArr })

    } catch (error) {
        res.status(500).json({ error })
        return;
    }
})

// ROUTE 4 - Update question endpoint
router.put('/update-question/:mainId/:questionId', fetchuser, async (req, res) => {
    try {
        let ques = await Question.findOne({ _id: req.params.mainId, user: req.user.id });
        if (!ques) {
            res.status(400).json({ error: `No data found` });
            return;
        }

        const index = getIndex(ques.questions, req.params.questionId);
        const oldData = ques.questions[index];

        const { question, picture, option, answer, _id, multiAns, marks } = oldData;
        const { u_question, u_picture, u_option, u_answer, u_multiAns, u_marks } = req.body;

        const newData = {
            "question": u_question.trim() !== "" ? u_question : question,
            "picture": u_picture ? u_picture : picture,
            "option": u_option.length > 0 ? u_option : option,
            "answer": u_answer.length > 0 ? u_answer : answer,
            "multiAns": u_multiAns !== "" ? u_multiAns : multiAns,
            "marks": u_marks ? u_marks : marks,
            "_id": _id,
        };

        ques.questions[index] = newData;
        await Question.findByIdAndUpdate(req.params.mainId, { $set: ques }, { new: true });
        res.status(200).json({ update: newData });
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Route 5 - get all question set -> question set card
router.get(`/get-question-set/`, fetchuser, async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return;
    }

    try {
        const userId = req.user.id;
        const question = await Question.find({ user: userId });
        res.status(200).json({ "data": question })

    } catch (error) {
        res.status(500).json({ error: error })
    }
});

// ROUTE 6 - Get actual question array
router.get('/get-question/:userId/:quizeCode/', async (req, res) => {
    try {

        let userId = req.params.userId;
        let quizeCode = req.params.quizeCode;

        const sets = await Question.findOne({ user: userId, quizeCode: quizeCode })
        res.status(200).json({ sets })

    } catch (error) {
        res.status(500).json({ error })
    }
})

// Route 7 - Publishing question set ready to use { $set: { isPublish: true }}
router.put(`/publish-question-set/:quizeCode`, fetchuser, async (req, res) => {
    try {
        let user = req.user.id;
        let quizeCode = req.params.quizeCode;
        let qName = req.body.qName;

        const response = await Question.findOneAndUpdate({ user: user, quizeCode: quizeCode }, { $set: { isPublish: true, qName: qName } })
        res.status(200).json({ response });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
});

// ROUTE 8 - delete question set of particular user
router.delete(`/delete-qSet/:qSetId/`, fetchuser, async (req, res) => {
    try {

        const qSetId = req.params.qSetId;
        const user = req.user.id;

        const response = await Question.findOneAndDelete({ user: user, _id: qSetId });
        res.status(200).json({ response });

    } catch (error) {
        res.status(500).json({ error: 'Server error please try again later' })
    }
})

module.exports = router;