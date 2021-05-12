import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		uppercase: true
	},
	password: {
		type: String,
		required: true
	}
});
