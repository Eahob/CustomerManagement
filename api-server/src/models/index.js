import mongoose from 'mongoose';
import * as schemas from './schemas';

export const Customer = mongoose.model('Customer', schemas.Customer);
export const Ticket = mongoose.model('Ticket', schemas.Ticket);
export const Service = mongoose.model('Service', schemas.Service);
export const Product = mongoose.model('Product', schemas.Product);
export const User = mongoose.model('User', schemas.User);
