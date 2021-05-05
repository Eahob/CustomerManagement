require('dotenv').config()

try {
	require('./mongoose').init(process.env, process.argv.includes('localDB'))
	require('./express').init(process.env.PORT)
} catch (error) {
	console.error(error);
	process.exit();
}
