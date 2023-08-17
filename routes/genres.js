const { Genre, validateGenre } = require('../models/genre')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

//get all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find()
        return res.status(200).send(genres)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

//get a single genre
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, genre not found')
        }
        const genre = await Genre.findById(id)
        if (!genre) return res.status(404).send('blog post not found')
        res.send(genre)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

//add a new genre

router.post('/', async function (req, res) {
    try {
        const genreObj = {
            name: req.body.name
        }
        const error = validateGenre(genreObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        const genre = new Genre({
            name: req.body.name
        })
        const result = await genre.save()
        res.status(200).send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

//update a genre
router.put('/:id', async function (req, res) {
    try {
        //first validate the incoming changes, if they do not validate to the standards then there's no need to query the db and find the genre for update
        const genreObj = {
            name: req.body.name,
        }
        const error = validateGenre(genreObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        //then find the genre
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, genre not found')
        }
        const genre = await Genre.findById(id)
        if (!genre) return res.status(404).send('genre not found')

        //then finally UPDATE the doc
        genre.set({
            name: genreObj.name,
        })

        await genre.save()

        res.status(200).send(genre)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})


//delete a genre
router.delete('/:id', async function (req, res) {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, genre not found')
        }
        const genre = await Genre.findById(id)
        if (!genre) return res.status(404).send('genre not found')

        const deletedGenre = await genre.deleteOne()

        res.status(200).send(deletedGenre)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
