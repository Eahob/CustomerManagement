import { getEnvValue } from './utils/api-utils.js';
import { EXIT_CODE_DB_CONNECTION_FAILED } from './utils/exit_codes';
import mongooseInit from './mongoose';
import expressInit from './express';

const remoteDB = process.argv.includes('remote');

console.log(`Connecting to ${remoteDB ? 'remote' : 'local'} database`);

const mongoUri = remoteDB ? getEnvValue('MONGODB_REMOTE') : getEnvValue('MONGODB_LOCAL');

const mongoDBConection = mongooseInit(mongoUri);

mongoDBConection.on('error', error => {
	console.error('Failed to connect to database');
	console.error(error);
	process.exit(EXIT_CODE_DB_CONNECTION_FAILED);
});

mongoDBConection.once('open', () => {
	console.log('Connected to database');
	expressInit(getEnvValue('PORT'));
});
