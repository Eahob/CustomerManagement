import mongoose from 'mongoose';

const ObjectId = mongoose.ObjectId;

const ticketSchema = new mongoose.Schema({
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
			taxable: {
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
			taxable: {
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

ticketSchema.pre('save', function(next) {
	if (!(this.services.length || this.products.length)) {
		next(new Error('services and products can not be empty at the same time'));
	}

	next();
});

export { ticketSchema };
