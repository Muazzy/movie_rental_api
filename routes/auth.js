const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const { User } = require('../models/user')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const error = validate(req.body)
        if (error) return res.status(400).send(error.details.at(0).message)

        let user = await User.findOne({ email: req.body.email })
        console.log('user is:', user)
        if (!user) return res.status(400).send('Invalid email or password')

        const isValid = await bcrypt.compare(req.body.password, user.password)
        console.log('isValid is:', isValid)
        if (!isValid) return res.status(400).send('Invalid email or password')

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey')) //moju (private key).
        console.log('token is:', token)

        res.status(200).send(token)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server error')
    }
})


function validate(req) {
    console.log(req)
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
    })
    const { error } = schema.validate(req)
    if (error) return error
    return
}

module.exports = router


//TIP: DONOT COPY PASTE ALWAYS Write code from scratch and dry run along the way, even if it takes some extra time of yours.