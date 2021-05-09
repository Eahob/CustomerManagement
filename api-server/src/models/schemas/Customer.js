import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Customer name required'],
		trim: true
	},
	surname: {
		type: String,
		required: [true, 'Customer surname required'],
		trim: true
	},
	phone: {
		type: String,
		unique: true,
		required: [true, 'Customer phone number required'],
		trim: true
	},
	email: {
		type: String,
		trim: true,
		lowercase: true
	},
	observations: {
		type: String,
		trim: true,
		default: ''
	},
	hide:{
		type: Boolean,
		required: true,
		default: false
	}
});

customerSchema.plugin(uniqueValidator);

export default customerSchema;
