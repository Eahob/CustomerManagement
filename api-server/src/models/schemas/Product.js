const mongoose = require('mongoose')

const { Schema, Schema: { ObjectId } } = mongoose

module.exports = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Product name required']
    },
    price: {
        type: Number,
        required: [true, 'Product price required']
    },
    tax: {
        type: Number,
        required: [true, 'Product tax required']
    },
    hide:{
        type: Boolean,
        required: true
    }
})
