const mongoose = require('mongoose')

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

module.exports = Customer
