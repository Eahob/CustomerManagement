const url = require('url')
const { Router } = require('express')

const { findCustomersBy, findTicketsBy, findServicesBy, findProductsBy } = require('./handlers')

const router = Router()

router.get('/customers', findCustomersBy)

router.get('/tickets', findTicketsBy)

router.get('/services', findServicesBy)

router.get('/products', findProductsBy)

module.exports = router
