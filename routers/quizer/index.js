const express = require('express')
const router = express.Router();
var cors = require('cors')

router.use(cors());
router.use(express.json())

router.get('/', (req, res) => { 
    return res.status(200).json({ status: 'Quizzer is live' })
});

router.use('/auth-register', require('./routes/register'));            // register --------> Instructor, Student
router.use('/auth-login', require('./routes/login'));                  // login -----------> Instructor, Student
router.use('/api/getDetails', require('./routes/getUserDetails'));     // getDetails ------> Instructor, Student
router.use('/api/report-bug', require('./routes/reportbug'));          // reportBug -------> Report bug (login require)
router.use('/genrate-question', require('./routes/genrateQuestion'));  // genrateQuestion -> genrate question set, CRUD -> for questions, get all question array, delete question set, publish qSet, 
router.use('/ask/', require("./routes/ask"));                          // AskQuestion -----> in about.js ask a question
router.use('/quiz/', require('./routes/joinQuize'));                   // joinTest --------> send question set without answer and user (Student) information also
router.use('/record/get-result', require('./routes/recordedResult'));
router.use('/verify/mail', require('./routes/verifyOtp'));

module.exports = router