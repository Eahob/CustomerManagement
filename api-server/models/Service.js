const mongoose = require('mongoose')

const Service = mongoose.model('services', {
    id: String,
    name: String,
    price: Number,
    tax: Number
})

module.exports = Service
