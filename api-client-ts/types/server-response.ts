export type ObjectId = string; // use proper ObjectId

export interface ServerData {
	_id: ObjectId
}

export interface Customer extends ServerData {
	name: string
	surname: string
	phone: string
	email: string
	observations: string
}

export interface Taxable extends ServerData {
	name: string
	price: number
	tax: number
}

type Total = {
	withTax: number,
	withoutTax: number
}

type TaxableTicketElement = Pick<Taxable, 'price' | 'tax'> & {
	taxable: ObjectId
	quantity: number
}

export interface Ticket<D = Date> extends ServerData {
	date: D,
	customer: ObjectId,
	services: TaxableTicketElement[],
	products: TaxableTicketElement[],
	total: Total
}

export interface Token extends ServerData {
	token: string | undefined
}

export type ServerStatus = Uppercase<'OK' | 'KO'>;

export type ServerError = string;

export type ServerResponse<SD> = {
	status: ServerStatus,
	data?: SD,
	error?: ServerError
}

export type EntryData = Customer | Taxable | Ticket
