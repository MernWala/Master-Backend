const express = require('express');
const router = express.Router();
const cors = require('cors')

router.use(cors())
router.use(express.json())

router.get('/', (req, res) => {
    return res.status(200).json({ status: 'Keep Plus is live' })
});

router.use('/api/auth/', require('./routes/auth'));
router.use('/api/notes/', require('./routes/notes'));

module.exports = router