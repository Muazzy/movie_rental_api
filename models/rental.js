const mongoose = require('mongoose')
const Joi = require('joi')

const { genreSchema } = require('./genre')


const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
            },
            dailyRentalRate: {
                type: Number,
                validate: {
                    validator: function (v) {
                        return v > 0
                    },
                    message: (params) => `${params.value} should be greater than zero!`
                },
                required: true
            }
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

const Rental = mongoose.model('rental', rentalSchema)


function validateRental(rental) {
    console.log('Joi is validating: ', rental)
    const schema = Joi.object({
        customerID: Joi.string().required(),
        movieID: Joi.string().required(),
    })
    const { error } = schema.validate(rental)
    if (error) return error
    return
}


module.exports = { Rental, validateRental }