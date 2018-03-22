const url = require('url')
const { Router } = require('express')
const bodyParser = require('body-parser')
const {
    findCustomersBy, findTicketsBy, findServicesBy, findProductsBy,
    createCustomer, createTicket, createService, createProduct,
    deleteCustomer, deleteTicket, deleteService, deleteProduct,
    showCustomer, showTicket, showService, showProduct,
    editCustomer, editTicket, editService, editProduct } = require('./handlers')

const router = Router()

//---

router.get('/customers', findCustomersBy)

router.get('/tickets', findTicketsBy)

router.get('/services', findServicesBy)

router.get('/products', findProductsBy)

//---

router.get('/customer/:id', showCustomer)

router.get('/ticket/:id', showTicket)

router.get('/service/:id', showService)

router.get('/product/:id', showProduct)

//---

router.delete('/customer/:id', deleteCustomer)

router.delete('/ticket/:id', deleteTicket)

router.delete('/service/:id', deleteService)

router.delete('/product/:id', deleteProduct)

//---

const jsonBodyParser = bodyParser.json()

//--

router.post('/customer', jsonBodyParser, createCustomer)

router.post('/ticket', jsonBodyParser, createTicket)

router.post('/service', jsonBodyParser, createService)

router.post('/product', jsonBodyParser, createProduct)

//--

router.put('/customer/:id', jsonBodyParser, editCustomer)

router.put('/ticket/:id', jsonBodyParser, editTicket)

router.put('/service/:id', jsonBodyParser, editService)

router.put('/product/:id', jsonBodyParser, editProduct)

module.exports = router
