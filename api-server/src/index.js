require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
//const uuid = require('uuid/v4')
const cors = require('cors')
const routes = require('./routes')

const port = process.env.PORT
const database = process.env.MONGO_DB

if (true) {
    const host = process.env.MONGO_HOST
    const mongo_port = process.env.MONGO_PORT
    mongoose.connect(`mongodb://${host}:${mongo_port}/${database}`)
} else {
    const user = process.env.MLAB_USER
    const password = process.env.MLAB_PASSWORD
    const mlab_port = process.env.MLAB_PORT
    mongoose.connect(`mongodb://${user}:${password}@ds1${mlab_port}.mlab.com:${mlab_port}/${database}`)
}

const app = express()
app.use(cors())

app.use('/api', routes)

app.listen(port, () => console.log(`Server api running on port ${port}`))
