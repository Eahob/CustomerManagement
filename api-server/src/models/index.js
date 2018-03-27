const mongoose = require('mongoose')

const { Customer, Ticket, Service, Product } = require('./schemas')
/*
const { Schema, Schema: { ObjectId } } = mongoose

const Customer = new Schema({
    name: {
        type: String,
        required: [true, 'Customer name required']
    },
    surname: {
        type: String,
        required: [true, 'Customer surname required']
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Customer phone number required']
    },
    email: String,
    observations: String,
    hide:{
        type: Boolean,
        required: true
    }
})

const Ticket = new Schema({
    date: {
        type: Date,
        required: true
    },
    customer: {
        type: ObjectId,
        ref: 'Customer',
        required: [true, 'Customer name required']
    },
    services: [
        {
            service: {
                type: ObjectId,
                ref: 'Service',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            tax: {
                type: Number,
                required: true
            }
        }
    ],
    products: [
        {
            product: {
                type: ObjectId,
                ref: 'Product',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            tax: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        withTax: {
            type: Number,
            required: true
        },
        withoutTax: {
            type: Number,
            required: true
        }
    }
})

const Service = new Schema({
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

const Product = new Schema({
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
*/
module.exports = {
    Customer: mongoose.model('Customer', Customer),
    Ticket: mongoose.model('Ticket', Ticket),
    Service: mongoose.model('Service', Service),
    Product: mongoose.model('Product', Product)
}
