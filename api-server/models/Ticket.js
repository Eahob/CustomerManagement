const mongoose = require('mongoose')

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

module.exports = Ticket
