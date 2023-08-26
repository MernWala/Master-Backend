const express = require('express');
const router = express.Router();
const cors = require('cors')

router.use(cors())

// 1.> ROUTE -> (a) Starter page backend
router.get('/', (req, res) => { 
    return res.status(200).json({status: 'Concept Studio is live'})
})

// 2.> ROUTE -> (a) get video with metadata
router.use('/videos/', require('./routes/video'))

// 3.> ROUTE -> (a) Send contact data
router.use('/contact/', require('./routes/contact'))

// 4.> ROUTE -> (a) Send testimonial, (b) Activate testimonial data
router.use('/testimonial/', require('./routes/testimonial'))

// 5.> ROUTE -> (a) Login Credential
router.use('/auth/', require('./routes/auth'))

module.exports = router