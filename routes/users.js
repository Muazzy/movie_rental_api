const express = require('express')
const bcrypt = require('bcrypt')
// const mongoose = require('mongoose')
const { User, validateUser } = require('../models/user')

//MIDDLEWARE FOR AUTHORIZATION
const auth = require('../middleware/auth')

const router = express.Router()


//we don't pass in the id of the users in params for security reasons, if we pass in the id then anyone can get information about any user by
//passing in their id
router.get('/me', auth, async (req, res) => {
    const userID = req.user._id
    const user = await User.findById(userID).select('-password') //exclude the confidential information of the user like password or cc information
    res.status(200).send(user)
})

router.post('/', async (req, res) => {
    try {
        const userObject = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        const error = validateUser(userObject)
        if (error) return res.status(400).send(error.details.at(0).message)

        let user = await User.findOne({ email: userObject.email })
        console.log(user)
        if (user) return res.status(400).send('User already registered.')


        const salt = await bcrypt.genSalt(10)
        console.log('salt is: ', salt)
        const hashedPass = await bcrypt.hash(userObject.password, salt)
        console.log('password is: ', hashedPass)

        user = new User({
            name: userObject.name,
            email: userObject.email,
            password: hashedPass
        })

        await user.save()

        //generate the auth token and send it in the header when a user registers
        const token = user.generateAuthToken()
        console.log('token is:', token)

        res.status(200).header('x-auth-token', token).send({
            name: user.name,
            email: user.email,
        })

    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router
