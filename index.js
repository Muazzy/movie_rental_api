const PORT = 3000 || process.env.PORT

const express = require('express')
const winston = require('winston')
const app = express()

require('./startup/logging')() // load the logging & error/exception handling service
require('./startup/config')()
require('./startup/routes')(app) // load all the routes
require('./startup/database')() // connect to database


app.listen(PORT, () => { winston.info(`app is running on PORT:${PORT}`) })