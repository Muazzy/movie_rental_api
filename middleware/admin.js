module.exports = function (req, res, next) {

    console.log('isAdmin:', req.user.isAdmin)
    //Asuming the user is already authorized
    if (!req.user.isAdmin) return res.status(403).send('Access denied') //Forbiddenc

    next()
}