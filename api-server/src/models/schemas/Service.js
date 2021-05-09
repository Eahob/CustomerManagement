const { Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const serviceSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: [true, 'Service name required'],
		trim: true,
		uppercase: true
	},
	price: {
		type: Number,
		required: [true, 'Service price required']
	},
	tax: {
		type: Number,
		required: [true, 'Service tax required']
	},
	hide:{
		type: Boolean,
		required: true,
		default: false
	}
});

serviceSchema.plugin(uniqueValidator);

module.exports = serviceSchema;
