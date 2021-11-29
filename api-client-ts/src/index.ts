import fetch, { HeaderInit, Headers, RequestInfo, RequestInit, Response } from 'node-fetch';
import {
	CMQuery,
	TicketQuery,
	TaxableQuery,
	Customer,
	CMServerResponse,
	CMLogin,
	Ticket,
	Taxable,
	ID,
	CMEntryData,
	ModifyResponse,
	CustomerQuery,
	TicketListElement
} from './types';

type Fetched<D> = D | undefined;
type PUTResponse = Promise<Fetched<ModifyResponse>>;
const fetchJsonData = <D>(url: RequestInfo, options: RequestInit): Promise<Fetched<D>> => fetch(url, options)
	.then(response => response.json())
	.then((json: CMServerResponse<D>): Fetched<D> | never => {
		if (json.status === 'KO') {
			throw new Error(json.error);
		}

		return json.data;
	});

const object2QueryParams = (params: CMQuery): string => Object.entries(params)
	.filter(([, v]) => v !== undefined && v !== null)
	.map(([k, v]) => {
		const field = encodeURIComponent(k);
		const value = encodeURIComponent(v instanceof Date ? v.getTime() : v.toString());

		return `${field}=${value}`
	})
	.join('&');

const urlWithParams = (url: string, params?: CMQuery): string => {
	if (params !== undefined && params !== null) {
		const query = object2QueryParams(params);

		return `${url}${query === '' ? '' : '?' + query}`;
	}

	return url;
};

const stringToDate = <T>(obj: any & {date: string}): T => {
	const { date, ...rest } = obj;

	return {
		date: new Date(date),
		...rest
	};
}

const ticketListElementTypeTransform = (ticketList: TicketListElement<string>): TicketListElement => stringToDate<TicketListElement>(ticketList);

const ticketTypeTransform = (ticket: Ticket<string>): Ticket => stringToDate<Ticket>(ticket);

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
		const data: Fetched<CMLogin> = await fetchJsonData<CMLogin>(`${this.#baseURL}/login`, {
			method: 'post',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		this.#token = data?.token;
	}

	#bearerCall<D>(method: string, path: string, data?: Partial<CMEntryData>, query?: CMQuery): Promise<Fetched<D>> {
		const url = urlWithParams(`${this.#baseURL}/${path}`, query);
		const headers: HeaderInit = {};
		const options: RequestInit = { method };

		headers.authorization = `Bearer ${this.#token}`;

		if (data !== undefined && data !== null) {
			options.body = JSON.stringify(data);
			headers['Content-Type'] = 'application/json';
		}

		options.headers = headers;

		return fetchJsonData<D>(url, options);
	}

	#call<D>(method: string, path: string, data?: Partial<CMEntryData>, query?: CMQuery): Promise<Fetched<D>> | never {
		if (this.#token === undefined) {
			throw new Error('Validation token is not set');
		}

		return this.#bearerCall<D>(method, path, data, query);
	}

	async validateToken(): Promise<boolean> {
		try {
			await this.#call<undefined>('get', 'validate');

			return true;
		} catch (e) {
			if (e instanceof Error) {
				console.error(e.message)
			}

			return false;
		}
	}

	#authorizedGETCall<D>(path: string, query?: CMQuery): Promise<Fetched<D>> {
		return this.#call<D>('get', path, undefined, query);
	}

	#authorizedPOSTCall(path: string, data: CMEntryData): Promise<Fetched<ID>> {
		return this.#call<ID>('post', path, data);
	}

	#authorizedPUTCall(path: string, data: Partial<CMEntryData>): PUTResponse {
		return this.#call<ModifyResponse>('put', path, data);
	}

	#authorizedDELETECall(path: string): Promise<void> {
		return this.#call('delete', path);
	}

	showCustomersBy(query: CustomerQuery): Promise<Fetched<Customer[]>> {
		return this.#authorizedGETCall<Customer[]>('customers', query);
	}

	showTicketsBy(query: TicketQuery): Promise<Fetched<TicketListElement[]>> {
		return this.#authorizedGETCall<TicketListElement<string>[]>('tickets', query).then(res => res?.map(ticketListElementTypeTransform));
	}

	showProductsBy(query: TaxableQuery): Promise<Fetched<Taxable[]>> {
		return this.#authorizedGETCall<Taxable[]>('products', query);
	}

	showServicesBy(query: TaxableQuery): Promise<Fetched<Taxable[]>> {
		return this.#authorizedGETCall<Taxable[]>('services', query);
	}

	showCustomer(id: string): Promise<Fetched<Customer>> {
		return this.#authorizedGETCall<Customer>(`customer/${id}`);
	}

	showTicket(id: string): Promise<Fetched<Ticket>> {
		return this.#authorizedGETCall<Ticket<string>>(`ticket/${id}`).then(res => res && ticketTypeTransform(res));
	}

	showService(id: string): Promise<Fetched<Taxable>> {
		return this.#authorizedGETCall<Taxable>(`service/${id}`);
	}

	showProduct(id: string): Promise<Fetched<Taxable>> {
		return this.#authorizedGETCall<Taxable>(`product/${id}`);
	}

	createCustomer(customer: Customer): Promise<Fetched<ID>> {
		return this.#authorizedPOSTCall('customer', customer);
	}

	createTicket(ticket: Ticket): Promise<Fetched<ID>> {
		return this.#authorizedPOSTCall('ticket', ticket);
	}

	createService(service: Taxable): Promise<Fetched<ID>> {
		return this.#authorizedPOSTCall('service', service);
	}

	createProduct(product: Taxable): Promise<Fetched<ID>> {
		return this.#authorizedPOSTCall('product', product);
	}

	deleteCustomer(id: string): Promise<void> {
		return this.#authorizedDELETECall(`customer/${id}`);
	}

	deleteTicket(id: string): Promise<void> {
		return this.#authorizedDELETECall(`ticket/${id}`);
	}

	deleteService(id: string): Promise<void> {
		return this.#authorizedDELETECall(`service/${id}`);
	}

	deleteProduct(id: string): Promise<void> {
		return this.#authorizedDELETECall(`product/${id}`);
	}

	modifyCustomer(id: string, customer: Partial<Customer>): PUTResponse {
		return this.#authorizedPUTCall(`customer/${id}`, customer);
	}

	modifyTicket(id: string, ticketContent: Partial<Pick<Ticket, 'products' | 'services'>>): PUTResponse {
		return this.#authorizedPUTCall(`ticket/${id}`, ticketContent);
	}

	modifyService(id: string, service: Partial<Taxable>): PUTResponse {
		return this.#authorizedPUTCall(`service/${id}`, service);
	}

	modifyProduct(id: string, product: Partial<Taxable>): PUTResponse {
		return this.#authorizedPUTCall(`product/${id}`, product);
	}
}
