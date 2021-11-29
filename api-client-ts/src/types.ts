type ObjectId = string; // use proper ObjectId

type _ID = {
	_id: ObjectId
};

type PriceRange = {
	pricemin?: number,
	pricemax?: number
};

type DateRange = {
	datemin?: Date,
	datemax?: Date
};

export type ID = {
	id: ObjectId
};

export type CMLogin = undefined | {
	token: string
};

export type Customer = {
	name: string,
	surname: string,
	phone: string,
	email?: string,
	observations?: string
};

export type CustomerQuery = Partial<Customer>;

export type CustomerListElement = Customer & _ID;

export type Taxable = {
	name: string,
	price: number,
	tax: number
};

export type TaxableListElement = Taxable & _ID;

export type TaxableQuery = Partial<Pick<Taxable, 'name'> & PriceRange>;

type TaxableListElementTicket = {
	taxable: ObjectId,
	price: number,
	quantity: number,
	tax: number
};

type Total = {
	withTax: number,
	withoutTax: number
};

export type Ticket<D = Date> = {
	date: D,
	customer: ObjectId,
	services: TaxableListElementTicket[],
	products: TaxableListElementTicket[],
	total: Total
};

export type TicketListElement<D = Date> = Ticket<D> & _ID;

export type TicketQuery = Partial<Pick<Ticket, 'customer'> & PriceRange & DateRange>;

export type CMQuery = CustomerQuery | TaxableQuery | TicketQuery;

export type CMEntryData = Customer | Taxable | Ticket;

export type ModifyResponse = Record<string, never>;

export type CMServerStatus = Uppercase<'OK' | 'KO'>;

export type CMServerError = string;

export type CMServerResponse<D> = {
	status: CMServerStatus,
	data?: D,
	error?: CMServerError
};
