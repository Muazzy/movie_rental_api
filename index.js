const PORT = 3000 || process.env.PORT
const mongooseURL = 'mongodb://localhost/vidly'

const config = require('config') //In order to set the environment vars

const express = require('express')
const mongoose = require('mongoose')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')



const app = express()

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}
//connect to db before setting up routes
mongoose.connect(mongooseURL)
    .then((_) => { console.log('connected to db') })
    .catch((e) => { console.error(e) })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//ROUTES
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)



app.listen(PORT, () => { console.log(`app is running on PORT:${PORT}`) })


///TODO: add object id validation directly into validate function