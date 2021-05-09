import mongoose from 'mongoose';
const ObjectId = mongoose.ObjectId;

export default new mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	customer: {
		type: ObjectId,
		ref: 'Customer',
		required: [true, 'Customer name required']
	},
	services: [
		{
			service: {
				type: ObjectId,
				ref: 'Service',
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			},
			tax: {
				type: Number,
				required: true
			}
		}
	],
	products: [
		{
			product: {
				type: ObjectId,
				ref: 'Product',
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			},
			tax: {
				type: Number,
				required: true
			}
		}
	],
	total: {
		withTax: {
			type: Number,
			required: true
		},
		withoutTax: {
			type: Number,
			required: true
		}
	}
});
