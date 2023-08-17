const mongoose = require('mongoose')
const Joi = require('joi')


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/m
    }
})

const Customer = mongoose.model('customer', customerSchema)


function validateCustomer(customer) {
    console.log('Joi is validating: ', customer)
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        phone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/m).required(),
        isGold: Joi.boolean()
    })
    const { error } = schema.validate(customer)
    // console.log(error)
    if (error) return error//will only return error. if the schema is valid then null
    return
}


module.exports = { Customer, validateCustomer }