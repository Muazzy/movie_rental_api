const winston = require('winston')
require('winston-mongodb')

const mongooseURL = 'mongodb://localhost/vidly'

module.exports = function () {


    process.on('uncaughtException', (err) => {
        winston.error(err.message, err)
        process.exit(1)
    })

    process.on('unhandledRejection', (err) => {
        winston.error(err.message, err)
        process.exit(1)
    })

    winston.add(new winston.transports.File({ filename: "logfile.log" }))
    winston.add(new winston.transports.MongoDB({ db: mongooseURL, level: 'info' })) //from level info to errors //IF THE DATABASE is down this will not be logged to database. so keep that in mind

}