const express = require('express')
const bcrypt = require('bcrypt')
// const mongoose = require('mongoose')
const { User, validateUser } = require('../models/user')

const router = express.Router()

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

        //TODO: hash the password and then store it in db.
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
        res.status(200).send({
            name: user.name,
            email: user.email,
        }) //TODO: Exclude the password property from this doc

    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router
