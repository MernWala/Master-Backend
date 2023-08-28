const fetchUser = require('../../../middleware/quizer/fetchuser')
const router = require('express').Router()
const QuestionSchema = require('../../../models/quizer/Question')
const TestRecord = require('../../../models/quizer/TestRecord')

// Route 1
router.get('/result', fetchUser, async (req, res) => {
    try {
        let user = req.user.id;

        // get all question set where user -> valid && isPublish: true
        let data = await QuestionSchema.find({ user: user, isPublish: true })
        let finalArr = [];

        // get all test record 
        data.forEach(async (ele) => {
            let result = await TestRecord.find({
                qSetid: ele._id
            })

            result.forEach((ele) => {
                finalArr.push(ele);
            })
        })

        setTimeout(() => {
            return res.status(200).json({ allQuestionData: data, finalData: finalArr })
        }, 1000);

    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router

