import mongoose from 'mongoose';
import * as schemas from './schemas';

export const Customer = mongoose.model('Customer', schemas.Customer);
export const Ticket = mongoose.model('Ticket', schemas.Ticket);
export const Service = mongoose.model('Service', schemas.Taxable);
export const Product = mongoose.model('Product', schemas.Taxable);
export const User = mongoose.model('User', schemas.User);
