const { Rental, validateRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort({ dateOut: -1 })
        return res.status(200).send(rentals)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, rental not found')
        }
        const rental = await Rental.findById(id)
        if (!rental) return res.status(404).send('rental not found')
        res.status(200).send(rental)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.post('/', async function (req, res) {
    try {
        const rentalObj = {
            movieID: req.body.movieID,
            customerID: req.body.customerID,
        }
        const error = validateRental(rentalObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        const customerID = rentalObj.customerID
        if (!mongoose.isValidObjectId(customerID)) {
            return res.status(400).send('invalid customer id')
        }
        const movieID = rentalObj.movieID
        if (!mongoose.isValidObjectId(movieID)) {
            return res.status(400).send('invalid movie id')
        }

        const customer = await Customer.findById(customerID)
        if (!customer) return res.status(400).send('no customer found with given customerID, please provide a valid id')
        const movie = await Movie.findById(movieID)
        if (!movie) return res.status(400).send('no movie found with given movieID, please provide a valid id')

        if (movie.numberInStock === 0) return res.status(400).send('the selected movie is not in stock, you may choose another one')

        const rental = new Rental({
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
            customer: {
                _id: customer._id,
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone
            },
            dateOut: req.body.dateOut,
            dateReturned: req.body.dateReturned,
            rentalFee: req.body.rentalFee,
        })

        //TODO: implement two phase commit using Fawn, also read a article about transactions in databases.
        //////////////////////////////////
        const result = await rental.save()
        //decrement the movie stock by 1 and save it
        movie.numberInStock--
        movie.save()
        //////////////////////////////////
        res.status(200).send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})


/////NOT NEEDED FOR NOW/////

// router.put('/:id', async function (req, res) {
//     try {
//         const rentalObj = {
//             movieID: req.body.movieID,
//             customerID: req.body.genreID,
//         }
//         const error = validateRental(rentalObj)
//         if (error) return res.status(400).send(error.details.at(0).message)

//         const customerID = rentalObj.customerID
//         if (!mongoose.isValidObjectId(customerID)) {
//             return res.status(400).send('invalid customer id')
//         }
//         const movieID = rentalObj.movieID
//         if (!mongoose.isValidObjectId(movieID)) {
//             return res.status(400).send('invalid movie id')
//         }

//         const customer = await Customer.findById(customerID)
//         if (!customer) return res.status(400).send('no customer found with given customerID, please provide a valid id')
//         const movie = await Movie.findById(movieID)
//         if (!movie) return res.status(400).send('no movie found with given movieID, please provide a valid id')


//         //then find the rental
//         const id = req.params.id
//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).send('invalid id, rental not found')
//         }
//         const rental = await Rental.findById(id)
//         if (!rental) return res.status(404).send('movie not found')

//         //then finally UPDATE the doc
//         rental.set({
//             movie: {
//                 _id: movie._id,
//                 title: movie.title,
//                 dailyRentalRate: movie.dailyRentalRate,
//             },
//             customer: {
//                 _id: customer._id,
//                 name: customer.name,
//                 isGold: customer.isGold,
//                 phone: customer.phone
//             },
//             dateOut: req.body.dateOut,
//             dateReturned: req.body.dateReturned,
//             rentalFee: req.body.rentalFee,
//         })

//         await rental.save()

//         res.status(200).send(rental)
//     }
//     catch (e) {
//         console.log(e)
//         return res.status(500).send('Server Error')
//     }
// })


// router.delete('/:id', async function (req, res) {
//     try {
//         const id = req.params.id
//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).send('invalid id, rental not found')
//         }
//         const rental = await Rental.findById(id)
//         if (!rental) return res.status(404).send('rental not found')

//         const deletedRental = await rental.deleteOne()

//         res.status(200).send(deletedRental)
//     }
//     catch (e) {
//         console.log(e)
//         return res.status(500).send('Server Error')
//     }
// })

module.exports = router
