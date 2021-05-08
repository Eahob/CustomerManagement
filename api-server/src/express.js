const cors = require('cors')
const express = require('express')
const routes = require('./routes')

const init = port => {
	const app = express()

	app.use(cors())

	app.use('/api', routes)

	app.listen(port, () => console.log(`Server api running on port ${port}`))
}

module.exports = { init }
