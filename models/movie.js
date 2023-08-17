const mongoose = require('mongoose')
const Joi = require('joi')

const { genreSchema } = require('./genre')


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: function (v) {
                return v >= 0
            },
            message: (params) => `${params.value} is not a positive number!`
        }
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
})

const Movie = mongoose.model('movie', movieSchema)


function validateMovie(movie) {
    console.log('Joi is validating: ', movie)
    const schema = Joi.object({
        title: Joi.string().required(),
        genreID: Joi.string().required(),
        numberInStock: Joi.number().integer().min(0),
        dailyRentalRate: Joi.number().greater(0).required(),
    })
    const { error } = schema.validate(movie)
    // console.log(error)
    if (error) return error//will only return error. if the schema is valid then null
    return
}


module.exports = { Movie, validateMovie }