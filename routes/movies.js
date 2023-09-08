const { Movie, validateMovie } = require('../models/movie')
const { Genre } = require('../models/genre')

const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

//Middleware
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')


router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ title: 1 })
        return res.status(200).send(movies)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, movie not found')
        }
        const movie = await Movie.findById(id)
        if (!movie) return res.status(404).send('movie not found')
        res.status(200).send(movie)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.post('/', auth, async function (req, res) {
    try {
        const movieObj = {
            title: req.body.title,
            genreID: req.body.genreID,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        }
        const error = validateMovie(movieObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        const genreID = movieObj.genreID
        if (!mongoose.isValidObjectId(genreID)) {
            return res.status(400).send('invalid genre id')
        }
        const genre = await Genre.findById(genreID)
        if (!genre) return res.status(400).send('no genre found with given genreID, please provide a valid id')

        const movie = new Movie({
            title: movieObj.title,
            genre: genre,
            numberInStock: movieObj.numberInStock,
            dailyRentalRate: movieObj.dailyRentalRate,
        })
        const result = await movie.save()
        res.status(200).send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.put('/:id', auth, async function (req, res) {
    try {
        const movieObj = {
            title: req.body.title,
            genreID: req.body.genreID,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        }
        const error = validateMovie(movieObj)
        if (error) return res.status(400).send(error.details.at(0).message)


        const genreID = movieObj.genreID
        if (!mongoose.isValidObjectId(genreID)) {
            return res.status(400).send('invalid genre id')
        }
        const genre = await Genre.findById(genreID)
        if (!genre) return res.status(400).send('no genre found with given genreID, please provide a valid id')


        //then find the genre
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, movie not found')
        }
        const movie = await Movie.findById(id)
        if (!movie) return res.status(404).send('movie not found')

        //then finally UPDATE the doc
        movie.set({
            title: movieObj.title,
            genre: genre,
            numberInStock: movieObj.numberInStock ? movieObj.numberInStock : movie.numberInStock,
            dailyRentalRate: movieObj.dailyRentalRate,
        })

        await movie.save()

        res.status(200).send(movie)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})

router.delete('/:id', [auth, admin], async function (req, res) {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, movie not found')
        }
        const movie = await Movie.findById(id)
        if (!movie) return res.status(404).send('movie not found')

        const deletedMovie = await movie.deleteOne()

        res.status(200).send(deletedMovie)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
