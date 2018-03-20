const findCustomersBy = require('./findCustomersBy')
const findTicketsBy = require('./findTicketsBy')
const findServicesBy = require('./findServicesBy')
const findProductsBy = require('./findProductsBy')
const createCustomer = require('./createCustomer')
const createTicket = require('./createTicket')
const createService = require('./createService')
const createProduct = require('./createProduct')
const deleteCustomer = require('./deleteCustomer')
const deleteTicket = require('./deleteTicket')
const deleteService = require('./deleteService')
const deleteProduct = require('./deleteProduct')
const showCustomer = require('./showCustomer')

module.exports = {
    findCustomersBy,
    findTicketsBy,
    findServicesBy,
    findProductsBy,
    createCustomer,
    createTicket,
    createService,
    createProduct,
    deleteCustomer,
    deleteTicket,
    deleteService,
    deleteProduct,
    showCustomer
}
