import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer({ instance: { storageEngine: 'wiredTiger' } });

// const RECONNECT_INTERVAL = 1000;
const mongooseOpts = {
	useCreateIndex: true,
	useUnifiedTopology: true,
	useNewUrlParser: true
	// autoReconnect: true,
	// reconnectTries: Number.MAX_VALUE,
	// reconnectInterval: RECONNECT_INTERVAL
};

export const connect = async() => {
	const uri = await mongod.getUri();

	await mongoose.connect(uri, mongooseOpts);
};

export const clearDatabase = async() => {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		if (Object.hasOwnProperty.call(collections, key)) {
			const collection = collections[key];

			await collection.deleteMany();
		}
	}
};

export const closeDatabase = async() => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};

export const { ValidationError } = mongoose.Error;
export const isTrimmed = string => !/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/.test(string);
