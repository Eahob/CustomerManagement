const mongoose = require('mongoose')

const { Schema, Schema: { ObjectId } } = mongoose

module.exports = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
