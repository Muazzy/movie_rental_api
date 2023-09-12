const winston = require('winston')
const mongoose = require('mongoose')

const mongooseURL = 'mongodb://localhost/vidly'

module.exports = function () {
    mongoose.connect(mongooseURL)
        .then((_) => winston.info('connected to db'))
    // .catch((e) => { console.error(e) }) //this will be now handled by the global error handler and exception handlers and the process will be terminated

}