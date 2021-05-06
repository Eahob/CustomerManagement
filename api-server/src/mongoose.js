const mongoose = require('mongoose')

const init = (env, local) => {
	let mongoUri;

	if (local) {
		const port = env.MONGO_PORT;
		const database = env.MONGO_DB;

		if (!port) {
			console.error('Missing mongo port in .env file');
			process.exit();
		}

		if (!database) {
			console.error('Missing mongo databese name in .env file');
			process.exit();
		}

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
	mongoose.connect(mongoUri)
}

module.exports = { init }
