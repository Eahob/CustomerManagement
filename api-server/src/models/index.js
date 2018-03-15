const mongoose = require('mongoose')

const { Schema, Schema: { ObjectId } } = mongoose

const Customer = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    observations: String
})

const Ticket = new Schema({
    date: {
        type: Date,
        required: true
    },
    customer: {
        type: ObjectId,
        ref: 'Customer',
        required: true
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
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    }
})

const Product = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    }
})

module.exports = {
    Customer: mongoose.model('Customer', Customer),
    Ticket: mongoose.model('Ticket', Ticket),
    Service: mongoose.model('Service', Service),
    Product: mongoose.model('Product', Product)
}