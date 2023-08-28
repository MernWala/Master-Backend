const mongoose = require('mongoose');

const CONCEPT_URI = process.env.CONCEPT_DB_URI
const KEEP_URI = process.env.KEEP_DB_URI
const QUIZER_URI = process.env.QUIZER_DB_URI

mongoose.conceptStudio = mongoose.createConnection(CONCEPT_URI)
mongoose.keepPlus = mongoose.createConnection(KEEP_URI)
mongoose.quizer = mongoose.createConnection(QUIZER_URI)

module.exports = mongoose;