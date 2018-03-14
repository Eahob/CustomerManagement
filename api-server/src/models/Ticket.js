const mongoose = require('mongoose')

const Ticket = mongoose.model('tickets', {
    id: String,
    date: Date,
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

module.exports = Ticket
