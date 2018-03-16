const url = require('url')
const { Router } = require('express')
const bodyParser = require('body-parser')
const { findCustomersBy, findTicketsBy, findServicesBy, findProductsBy, createCustomer } = require('./handlers')

const router = Router()

router.get('/customers', findCustomersBy)

router.get('/tickets', findTicketsBy)

router.get('/services', findServicesBy)

router.get('/products', findProductsBy)

const jsonBodyParser = bodyParser.json()

router.post('/customer', jsonBodyParser, createCustomer)

module.exports = router
