require('dotenv').config()
const port = process.env.PORT

if (!port) {
	console.error('Missing PORT configuration in .env file');
	process.exit();
}

try {
	require('./mongoose.js').init(process.env, process.argv.includes('localDB'))
} catch (error) {
	console.error(error);
	process.exit();
}

const cors = require('cors')
const express = require('express')
const routes = require('./routes')
const app = express()

app.use(cors())

app.use('/api', routes)

app.listen(port, () => console.log(`Server api running on port ${port}`))
