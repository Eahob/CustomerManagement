const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = new Schema({
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
	hide:{
		type: Boolean,
		required: true,
		default: false
	}
});

productSchema.plugin(uniqueValidator);

module.exports = productSchema;
