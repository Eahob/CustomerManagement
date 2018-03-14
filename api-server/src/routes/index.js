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

function showAndFilterText(req, res) {
    // to do: add pagination
    let filter = {}
    if (req.query) {
        for (const prop in req.query) {
            switch (prop) {
                case 'pricemin':
                    if (!filter.price) filter.price = {}
                    filter.price['$gte'] = req.query.pricemin
                    break
                case 'pricemax':
                    if (!filter.price) filter.price = {}
                    filter.price['$lte'] = req.query.pricemax
                    break
                case 'datemin':
                    if (!filter.date) filter.date = {}
                    filter.date['$gte'] = new Date(req.query.datemin)
                    break
                case 'datemax':
                    if (!filter.date) filter.date = {}
                    filter.date['$lte'] = new Date(req.query.datemax)
                    break
                default:
                    let queryValue = req.query[prop]
                    if (queryValue) {
                        filter[prop] = { $regex: new RegExp(queryValue, 'i') }
                    }
                    break
            }
        }
    }
    show(req, res, filter)
}
function show(req, res, filter = {}) {
    const model = selectMongooseModel(url.parse(req.url).pathname)
    model.find(filter, { _id: 0, __v: 0 })
        .then(list => {
            res.json(successResponse(list))
        })
        .catch(failResponse)
}

router.get('/customers', (req, res) => {
    showAndFilterText(req, res)
})

router.get('/tickets', (req, res) => {
    //show(req, res)
    showAndFilterText(req, res)
})

router.get('/services', (req, res) => {
    showAndFilterText(req, res)
})

router.get('/products', (req, res) => {
    showAndFilterText(req, res)
})

module.exports = router
