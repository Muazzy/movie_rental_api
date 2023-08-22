const express = require('express')
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

        let user = User.findOne({ email: userObject.email })
        if (user) return res.status(400).send('User already registered.')

        user = new User({
            name: userObject.name,
            email: userObject.email,
            password: userObject.password
        })

        await user.save()
        res.status(200).send(user) //TODO: Exclude the password property from this doc

    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router
