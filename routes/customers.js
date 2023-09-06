const { Customer, validateCustomer } = require('../models/customer')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

//Middleware
const auth = require('../middleware/auth')


router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ name: 1 })
        return res.status(200).send(customers)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, customer not found')
        }
        const customer = await Customer.findById(id)
        if (!customer) return res.status(404).send('customer not found')
        res.send(customer)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.post('/', auth, async function (req, res) {
    try {
        const customerObj = {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        }
        const error = validateCustomer(customerObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        const customer = new Customer({
            name: customerObj.name,
            phone: customerObj.phone,
            isGold: customerObj.isGold
        })
        const result = await customer.save()
        res.status(200).send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(500).send('Server Error')
    }
})

router.put('/:id', auth, async function (req, res) {
    try {
        const customerObj = {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        }
        const error = validateCustomer(customerObj)
        if (error) return res.status(400).send(error.details.at(0).message)

        //then find the genre
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, customer not found')
        }
        const customer = await Customer.findById(id)
        if (!customer) return res.status(404).send('customer not found')

        //then finally UPDATE the doc
        customer.set({
            name: customerObj.name,
            phone: customerObj.phone,
            isGold: customerObj.isGold ?? customer.isGold
        })

        await customer.save()

        res.status(200).send(customer)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})

router.delete('/:id', auth, async function (req, res) {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('invalid id, customer not found')
        }
        const customer = await Customer.findById(id)
        if (!customer) return res.status(404).send('customer not found')

        const deletedCustomer = await customer.deleteOne()

        res.status(200).send(deletedCustomer)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
