const mongoose = require('mongoose');
const { exitIfFalse } = require('./utils/api-utils')

const init = (env, local) => {
	let mongoUri;
	const database = env.MONGO_DB;

	if (local) {
		const port = env.MONGO_PORT;

		exitIfFalse('Missing mongo port in .env file', port)
		exitIfFalse('Missing mongo databese name in .env file', database)

		mongoUri = `mongodb://127.0.0.1:${port}/${database}`;
	} else {
		const user = env.MLAB_USER;
		const password = env.MLAB_PASSWORD;
		const mlab_port = env.MLAB_PORT;
		mongoUri = `mongodb://${user}:${password}@ds1${mlab_port}.mlab.com:${mlab_port}/${database}`;
	}

	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useUnifiedTopology', true);
	mongoose.connect(mongoUri);

	return mongoose.connection;
};

module.exports = { init }
