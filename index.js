require('dotenv').config()
const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
const host = "http://localhost:5000"

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'Master server is working',
        'current-gateways': {
            'concept-studio': `${host}/concept-studio`,
            'keep-plus': `${host}/keep-plus`
        }
    })
})

// Main gateway 1 -> Concept Studio
app.use('/concept-studio', require('./routers/conceptStudio/index'))

// Main gateway 2 -> Keep Plus
app.use('/keep-plus', require('./routers/keepPlus/index'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})