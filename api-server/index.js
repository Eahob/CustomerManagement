require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const uuid = require('uuid/v4')
const cors = require('cors')

const port = process.env.PORT
const host = process.env.MONGO_HOST
const mongo_port = process.env.MONGO_PORT
const database = process.env.MONGO_DB

mongoose.connect(`mongodb://${host}/${database}`)

const jsonBodyParser = bodyParser.json()
const app = express()
app.use(cors())

function successResponse(data) {
    const res = { status: 'OK' }

    if (data) res.data = data

    return res
}

function failResponse(error) {
    const res = { status: 'KO' }

    if (error) res.error = error

    return res
}
const Customer = mongoose.model('customers', {
    id: String,
    name: String,
    surname: String,
    phone: String,
    history: [
        {
            idTicket: String
        }
    ],
    observations: String
})
app.get('/api/customers', (req, res) => {
    // Show customers
    // Search by query maybe?
    // pagination
    Customer.find({}, { _id: 0, __v: 0 }).then(customers => {
        res.json(successResponse(customers))
    })
})
app.get('/api/customers/:id', (req, res) => {
    // Show customer info
})
app.get('/api/services', (req, res) => {
    // show services
})
app.get('/api/products', (req, res) => {
    // show services
})

app.get('/api/tickets', (req, res) => {
    // show tickets
    // diferent querys
    //.toLocaleDateString('es-ES',{hour:"2-digit",minute:"2-digit"})
})
/*
const Customer = mongoose.model('customers', {
    id: String,
    name: String,
    surname: String,
    phone: String,
    history: [
        {
            idTicket: String
        }
    ],
    observations: String
})

const Service = mongoose.model('services', {
    id: String,
    name: String,
    price: Number,
    tax: Number
})

const Product = mongoose.model('products', {
    id: String,
    name: String,
    price: Number,
    tax: Number
})

const Ticket = mongoose.model('tickets', {
    id: String,
    time: {
        date: String,
        minute: Number,
        hour: Number,
        day: Number,
        year: Number
    },
    idCustomer: String,
    services: [
        {
            name: String,
            price: Number,
            quantity: Number,
            tax: Number
        }
    ],
    products:[
        {
            name: String,
            price: Number,
            quantity: Number,
            tax: Number
        }
    ],
    total: {
        withTax: Number,
        withoutTax: Number
    }
})
*/
/*
app.post('/api/customers', jsonBodyParser, (req, res) => {
    // Create new costumer
    const { body: { name, surname, phone } } = req
    const id = uuid()
    Customer.create({ id, name, surname, phone, history:[], observations:'' })
        .then(res.json({ status: 'OK', message:'Customer creation successful' }))
        .catch(err => {
            res.json({ status: 'K0', message:'Customer creation failed' })
        })
})
*/

app.listen(port, () => console.log(`Server api running on port ${port}`))
