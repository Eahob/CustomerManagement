const url = require('url')
const { Router } = require('express')
const Customer = require('../models/Customer')
const Ticket = require('../models/Ticket')
const Service = require('../models/Service')
const Product = require('../models/Product')

const router = Router()

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

function selectMongooseModel(pathname) {
    switch (pathname) {
        case '/customers':
        case '/customers/':
            return Customer
        case '/tickets':
        case '/tickets/':
            return Ticket
        case '/services':
        case '/services/':
            return Service
        case '/products':
        case '/products/':
            return Product
        default:
            return undefined
    }
}

function filterAndShow(req, res) {
    // to do: add pagination
    let filter = {}
    if (req.query) {
        for (const prop in req.query) {
            
            filter[prop] =  { $regex: new RegExp(req.query[prop], 'i') }
            //console.log(`req.query.${prop} = ${req.query[prop]}`);
        }
        //const { name } = req.query
        //const regexp = new RegExp(name, 'i')
        //filter = { name: { $regex: regexp } }
    }
    console.log(filter)

    const model = selectMongooseModel(url.parse(req.url).pathname)
    model.find(filter, { _id: 0, __v: 0 })
        .then(list => {
            res.json(successResponse(list))
        })
        .catch(failResponse)
}

router.get('/customers', (req, res) => {
    filterAndShow(req, res)
})

router.get('/tickets', (req, res) => {
    filterAndShow(req, res)
})

router.get('/services', (req, res) => {
    filterAndShow(req, res)
})

router.get('/products', (req, res) => {
    filterAndShow(req, res)
})

module.exports = router
