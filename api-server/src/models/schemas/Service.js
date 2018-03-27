const mongoose = require('mongoose')

const { Schema, Schema: { ObjectId } } = mongoose

module.exports = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Service name required']
    },
    price: {
        type: Number,
        required: [true, 'Service price required']
    },
    tax: {
        type: Number,
        required: [true, 'Service tax required']
    },
    hide:{
        type: Boolean,
        required: true
    }
})
