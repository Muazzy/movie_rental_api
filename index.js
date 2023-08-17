const PORT = 3000 || process.env.PORT
const mongooseURL = 'mongodb://localhost/vidly'

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//connect to db before setting up routes
mongoose.connect(mongooseURL)
    .then((value) => { console.log('connected to db') })
    .catch((e) => { console.error(e) })

//setup routes
// genre: name
// customer: name, isGold, phone
// movies: title, genre (embeded), numberInStock, dailyRentalRate

app.listen(PORT, () => { console.log(`app is running on PORT:${PORT}`) })