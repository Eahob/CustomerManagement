import type * as CM from '../types';

export type { CM };

const fetchJsonData = <D>(
	...[url, options]: Parameters<typeof fetch>): Promise<D | undefined> => fetch(url, options)
		.then(response => response.json())
		.then((json: CM.Response.ServerResponse<D>): D | undefined | never => {
			if (json.status === 'KO') {
				throw new Error(json.error);
			}

			return json.data;
		});

const object2QueryParams = (params: CM.Query.ShowBy): string => Object.entries(params)
	.filter(([, v]) => v !== undefined && v !== null)
	.map(([k, v]) => {
		const field = encodeURIComponent(k);
		const value = encodeURIComponent(v instanceof Date ? v.getTime() : v.toString());

		return `${field}=${value}`;
	})
	.join('&');

const urlWithParams = (url: string, params?: CM.Query.ShowBy): string => {
	if (params !== undefined && params !== null) {
		const query = object2QueryParams(params);

		return `${url}${query === '' ? '' : '?' + query}`;
	}

	return url;
};

const ticketTypeTransform = ({ date, ...rest }: CM.Response.Ticket<string>): CM.Response.Ticket => ({
	date: new Date(date),
	...rest
});

export class API {
	#baseURL: string;
	#token: string | undefined;

	constructor(host: string, port?: number, protocol = 'https') {
		const _port = port === undefined || port === null ? '' : `:${port}`;

		this.#baseURL = `${protocol}://${host}${_port}/api`;
		this.#token = undefined;
	}

	get token() {
		return this.#token;
	}

	get baseURL() {
		return this.#baseURL;
	}

	async login(username: string, password: string): Promise<void> {
		const data = await fetchJsonData<CM.Response.Token>(`${this.#baseURL}/login`, {
			method: 'post',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		this.#token = data?.token;
	}

	#bearerCall<D>(method: string, path: string, data?: Partial<CM.Response.EntryData>, query?: CM.Query.ShowBy) {
		const [url, options]: Parameters<typeof fetch> = [
			urlWithParams(`${this.#baseURL}/${path}`, query),
			{ method }
		];

		options.headers = [['authorization', `Bearer ${this.#token}`]];

		if (data !== undefined && data !== null) {
			options.body = JSON.stringify(data);
			options.headers.push(['Content-Type', 'application/json']);
		}

		return fetchJsonData<D>(url, options);
	}

	#call<D>(
		method: string,
		path: string,
		data?: Partial<CM.Response.EntryData>,
		query?: CM.Query.ShowBy
	): Promise<D | undefined> | never {
		if (this.#token === undefined) {
			throw new Error('Validation token is not set');
		}

		return this.#bearerCall<D>(method, path, data, query);
	}

	async validateToken(): Promise<boolean> {
		try {
			await this.#call('get', 'validate');

			return true;
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message);
			}

			return false;
		}
	}

	#authorizedGETCall<D>(path: string, query?: CM.Query.ShowBy) {
		return this.#call<D>('get', path, undefined, query);
	}

	#authorizedPOSTCall(path: string, data: CM.Response.ServerData) {
		return this.#call<CM.Response.ServerData>('post', path, data);
	}

	#authorizedPUTCall(path: string, data: Partial<CM.Response.EntryData>) {
		return this.#call<CM.Response.ServerData>('put', path, data);
	}

	#authorizedDELETECall(path: string): Promise<undefined> {
		return this.#call('delete', path);
	}

	showCustomersBy(query: CM.Query.CustomerQuery) {
		return this.#authorizedGETCall<CM.Response.Customer[]>('customers', query);
	}

	showTicketsBy(query: CM.Query.TicketQuery) {
		return this.#authorizedGETCall<CM.Response.Ticket<string>[]>('tickets', query)
			.then(res => res?.map(ticketTypeTransform));
	}

	showProductsBy(query: CM.Query.TaxableQuery) {
		return this.#authorizedGETCall<CM.Response.Taxable[]>('products', query);
	}

	showServicesBy(query: CM.Query.TaxableQuery) {
		return this.#authorizedGETCall<CM.Response.Taxable[]>('services', query);
	}

	showCustomer(id: CM.Response.ObjectId) {
		return this.#authorizedGETCall<CM.Response.Customer>(`customer/${id}`);
	}

	showTicket(id: CM.Response.ObjectId) {
		return this.#authorizedGETCall<CM.Response.Ticket<string>>(`ticket/${id}`)
			.then(res => res && ticketTypeTransform(res));
	}

	showService(id: CM.Response.ObjectId) {
		return this.#authorizedGETCall<CM.Response.Taxable>(`service/${id}`);
	}

	showProduct(id: CM.Response.ObjectId) {
		return this.#authorizedGETCall<CM.Response.Taxable>(`product/${id}`);
	}

	createCustomer(customer: CM.Response.Customer) {
		return this.#authorizedPOSTCall('customer', customer);
	}

	createTicket(ticket: CM.Response.Ticket) {
		return this.#authorizedPOSTCall('ticket', ticket);
	}

	createService(service: CM.Response.Taxable) {
		return this.#authorizedPOSTCall('service', service);
	}

	createProduct(product: CM.Response.Taxable) {
		return this.#authorizedPOSTCall('product', product);
	}

	deleteCustomer(id: CM.Response.ObjectId) {
		return this.#authorizedDELETECall(`customer/${id}`);
	}

	deleteTicket(id: CM.Response.ObjectId) {
		return this.#authorizedDELETECall(`ticket/${id}`);
	}

	deleteService(id: CM.Response.ObjectId) {
		return this.#authorizedDELETECall(`service/${id}`);
	}

	deleteProduct(id: CM.Response.ObjectId) {
		return this.#authorizedDELETECall(`product/${id}`);
	}

	modifyCustomer(id: CM.Response.ObjectId, customer: Partial<Omit<CM.Response.Customer, '_id'>>) {
		return this.#authorizedPUTCall(`customer/${id}`, customer);
	}

	modifyTicket(id: CM.Response.ObjectId, ticketContent: Partial<Pick<CM.Response.Ticket, 'products' | 'services'>>) {
		return this.#authorizedPUTCall(`ticket/${id}`, ticketContent);
	}

	modifyService(id: CM.Response.ObjectId, service: Partial<CM.Response.Taxable>) {
		return this.#authorizedPUTCall(`service/${id}`, service);
	}

	modifyProduct(id: CM.Response.ObjectId, product: Partial<CM.Response.Taxable>) {
		return this.#authorizedPUTCall(`product/${id}`, product);
	}
}
