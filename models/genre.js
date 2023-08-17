const mongoose = require('mongoose')
const Joi = require('joi')


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
})

const Genre = mongoose.model('genre', genreSchema)


function validateGenre(genre) {
    console.log('Joi is validating: ', genre)
    const schema = Joi.object({
        name: Joi.string().required().min(3),
    })
    const { error } = schema.validate(genre)
    // console.log(error)
    if (error) return error//will only return error. if the schema is valid then null
    return
}


module.exports = { genreSchema, Genre, validateGenre }