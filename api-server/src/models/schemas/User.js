import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const stringDoesNotHaveInnerSpaces = string => !/[\s\uFEFF\xA0]+/.test(string);

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		uppercase: true,
		validate: {
			validator: stringDoesNotHaveInnerSpaces,
			message: 'No spaces allowed in username'
		}
	},
	password: {
		type: String,
		trim: true,
		required: true,
		validate: {
			validator: stringDoesNotHaveInnerSpaces,
			message: 'No spaces allowed in password'
		}
	}
});

userSchema.plugin(uniqueValidator);

export { userSchema };
