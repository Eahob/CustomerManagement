const mongoose = require('mongoose')

const Product = mongoose.model('products', {
    id: String,
    name: String,
    price: Number,
    tax: Number
})

module.exports = Product
