require('dotenv').config()

const express = require('express')
//const bodyParser = require('body-parser')
const mongoose = require('mongoose')
//const uuid = require('uuid/v4')
const cors = require('cors')
const routes = require('./routes')

const port = process.env.PORT
const host = process.env.MONGO_HOST
const mongo_port = process.env.MONGO_PORT
const database = process.env.MONGO_DB

mongoose.connect(`mongodb://${host}:${mongo_port}/${database}`)

//const jsonBodyParser = bodyParser.json()
const app = express()
app.use(cors())

app.use('/api', routes)

app.listen(port, () => console.log(`Server api running on port ${port}`))
