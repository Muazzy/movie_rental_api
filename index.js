const PORT = 3000 || process.env.PORT
const mongooseURL = 'mongodb://localhost/vidly'

const express = require('express')
const mongoose = require('mongoose')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')



const app = express()

//connect to db before setting up routes
mongoose.connect(mongooseURL)
    .then((_) => { console.log('connected to db') })
    .catch((e) => { console.error(e) })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//ROUTES
app.use('/api/genre', genres)
app.use('/api/customer', customers)
app.use('/api/movie', movies)

app.listen(PORT, () => { console.log(`app is running on PORT:${PORT}`) })