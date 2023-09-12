const config = require('config') //In order to set the environment vars


module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined') //this will be handled by the global error handler
    }
}