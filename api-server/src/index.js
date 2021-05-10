import { getEnvValue } from './utils/api-utils.js';
import mongooseInit from './mongoose';
import expressInit from './express';

const remoteDB = process.argv.includes('remote');

console.log(`Connecting to ${remoteDB ? 'remote' : 'local'} database`);

const mongoUri = remoteDB ? getEnvValue('MONGODB_REMOTE') : getEnvValue('MONGODB_LOCAL');

const mongoDBConection = mongooseInit(mongoUri);

mongoDBConection.on('error', error => {
	console.error('Failed to connect to database');
	console.error(error);
	process.exit(1);
});

mongoDBConection.once('open', () => {
	console.log('Connected to database');
	expressInit(getEnvValue('PORT'))
});
