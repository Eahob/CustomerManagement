import mongoose from 'mongoose';
import {
	customerSchema,
	ticketSchema,
	taxableSchema,
	userSchema
} from './schemas';

export const Customer = mongoose.model('Customer', customerSchema);
export const Ticket = mongoose.model('Ticket', ticketSchema);
export const Service = mongoose.model('Service', taxableSchema);
export const Product = mongoose.model('Product', taxableSchema);
export const User = mongoose.model('User', userSchema);
