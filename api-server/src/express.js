const cors = require('cors')
const express = require('express')
const routes = require('./routes')
const { exitIfFalse } = require('./utils/api-utils')


const init = port => {
	exitIfFalse('Missing PORT configuration in .env file', port)

	const app = express()

	app.use(cors())
	
	app.use('/api', routes)
	
	app.listen(port, () => console.log(`Server api running on port ${port}`))
}

module.exports = { init }
