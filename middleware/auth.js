const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send('Access denied. No token provided')

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey')) //{ _id: '64f84378d8d96a1a3315d4c9', iat: 1693991800 }
        console.log('payload is', decodedPayload)
        req.user = decodedPayload
        next()
    } catch (ex) {
        //BAD request
        return res.status(400).send('Invalid Token')
    }
}