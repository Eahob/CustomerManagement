import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: [true, 'Product name required'],
		uppercase: true
	},
	price: {
		type: Number,
		required: [true, 'Product price required']
	},
	tax: {
		type: Number,
		required: [true, 'Product tax required']
	},
	hide: {
		type: Boolean,
		required: true,
		default: false
	}
});

productSchema.plugin(uniqueValidator);

export default productSchema;
