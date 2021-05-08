const { getEnvValue } = require('./utils/api-utils');
require('dotenv').config();

const remoteDB = process.argv.includes('remote');

console.log(`Connecting to ${remoteDB ? 'remote' : 'local'} database`);

const mongoUri = remoteDB ? getEnvValue('MONGODB_REMOTE') : getEnvValue('MONGODB_LOCAL');

const mongoDBConection = require('./mongoose').init(mongoUri);

mongoDBConection.on('error', error => {
	console.error('Failed to connect to database');
	console.error(error);
	process.exit(1);
});

mongoDBConection.once('open', () => {
	console.log('Connected to database');
	require('./express').init(getEnvValue('PORT'))
});
