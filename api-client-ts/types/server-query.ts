import { Customer, Taxable, Ticket } from './server-response';

type DateRange = {
	datemin?: Date
	datemax?: Date
}

type PriceRange = {
	pricemin?: number
	pricemax?: number
}

export type CustomerQuery = Partial<Customer>

export type TaxableQuery = Partial<Pick<Taxable, 'name'> & PriceRange>

export type TicketQuery = Partial<Pick<Ticket, 'customer'> & PriceRange & DateRange>

export type ShowBy = CustomerQuery | TaxableQuery | TicketQuery;
