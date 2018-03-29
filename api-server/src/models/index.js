const mongoose = require('mongoose')

const { Customer, Ticket, Service, Product, User } = require('./schemas')

module.exports = {
    Customer: mongoose.model('Customer', Customer),
    Ticket: mongoose.model('Ticket', Ticket),
    Service: mongoose.model('Service', Service),
    Product: mongoose.model('Product', Product),
    User: mongoose.model('User', User)
}
