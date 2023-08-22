const mongoose = require('mongoose')
const Joi = require('joi')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i //email validator regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})

const User = mongoose.model('user', userSchema)


function validateUser(user) {
    console.log('Joi is validating: ', user)
    const schema = Joi.object({
        name: Joi.string().required(),
        // email: Joi.string().required().regex(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
    })
    const { error } = schema.validate(user)
    if (error) return error
    return
}


module.exports = { User, validateUser }