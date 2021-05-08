const { Schema } = require('mongoose');

module.exports = new Schema({
	name: {
		type: String,
		required: [true, 'Customer name required']
	},
	surname: {
		type: String,
		required: [true, 'Customer surname required']
	},
	phone: {
		type: String,
		unique: true,
		required: [true, 'Customer phone number required']
	},
	email: String,
	observations: String,
	hide:{
		type: Boolean,
		required: true
	}
});
