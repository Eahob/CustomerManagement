require('dotenv').config()

console.log('Connecting to database');

const mongoDBConection = require('./mongoose').init(process.env, process.argv.includes('localDB'))

mongoDBConection.on('error', error => {
	console.error('Failed to connect to database');
	console.error(error);
	process.exit(1);
});

mongoDBConection.once('open', () => {
	console.log('Connected to database');
	require('./express').init(process.env.PORT)
});
