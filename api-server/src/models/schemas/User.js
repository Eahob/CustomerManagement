import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		uppercase: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	}
});
