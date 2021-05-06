require('dotenv').config()
require('./mongoose').init(process.env, process.argv.includes('localDB'))
require('./express').init(process.env.PORT)
