import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const taxableSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: [true, 'taxable name required'],
		trim: true,
		uppercase: true
	},
	price: {
		type: Number,
		min: 0,
		required: [true, 'taxable price required']
	},
	tax: {
		type: Number,
		min: 0,
		required: [true, 'taxable tax required']
	},
	hide: {
		type: Boolean,
		required: true,
		default: false
	}
});

taxableSchema.plugin(uniqueValidator);

export { taxableSchema };
