import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer({ instance: { storageEngine: 'wiredTiger' } });

const mongooseOpts = {
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useNewUrlParser: true
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

export const { ObjectId } = mongoose.Types;
export const { ValidationError } = mongoose.Error;
export const isTrimmed = string => !/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/.test(string);
