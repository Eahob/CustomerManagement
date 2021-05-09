import mongoose from 'mongoose';

export default new mongoose.Schema({
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
