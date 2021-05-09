const { Schema } = require('mongoose');

module.exports = new Schema({
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
