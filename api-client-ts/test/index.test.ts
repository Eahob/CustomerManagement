jest.mock('node-fetch');
import fetch, { RequestInit } from 'node-fetch';
import { API } from '../src/';
import { mocked } from 'ts-jest/utils';
import {
	CMLogin,
	CMQuery,
	CMServerError,
	CMServerResponse,
	CMServerStatus,
	Customer,
	CustomerListElement,
	CustomerQuery,
	Taxable,
	TaxableListElement,
	TaxableQuery,
	Ticket,
	TicketListElement,
	TicketQuery
} from '../src/types';

const { Response } = jest.requireActual('node-fetch');

const mockFetchResponse = <D>(data?: D, status: CMServerStatus = 'OK', error?: CMServerError) => {
	const response: CMServerResponse<D> = {
		status,
		data,
		error
	};

	const jsonString = JSON.stringify(response);

	return mocked(fetch).mockReturnValue(Promise.resolve(new Response(jsonString)));
};

const makeRequest = (method: string, token: string): RequestInit => ({
	headers: {
		authorization: `Bearer ${token}`
	},
	method
});

const makeRequestBody = (method: string, token: string, data: any): RequestInit => ({
	headers: {
		'authorization': `Bearer ${token}`,
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data),
	method
});

const makeGetRequest = (token: string): RequestInit => makeRequest('get', token);

interface API_TEST extends API, Record<string, any> {}

const authorizedAPIShowByMethodsName = [
	'showCustomersBy',
	'showTicketsBy',
	'showProductsBy',
	'showServicesBy'
];

const authorizedAPIShowMethodsName = [
	'showCustomer',
	'showTicket',
	'showService',
	'showProduct'
];

const authorizedAPICreateMethodsName = [
	'createCustomer',
	'createTicket',
	'createService',
	'createProduct'
];

const authorizedAPIDeleteMethodsName = [
	'deleteCustomer',
	'deleteTicket',
	'deleteService',
	'deleteProduct'
];

const authorizedAPIModifyMethodsName = [
	'modifyCustomer',
	'modifyTicket',
	'modifyService',
	'modifyProduct'
];

const authorizedAPIMethodsName = [
	'validateToken',
	...authorizedAPIShowByMethodsName,
	...authorizedAPIShowMethodsName,
	...authorizedAPICreateMethodsName,
	...authorizedAPIDeleteMethodsName,
	...authorizedAPIModifyMethodsName
];

const host = 'localhost';
const port = 500;
const baseURL = `https://${host}:${port}/api`;
const getUrl = (endpoint: string): string => `${baseURL}/${endpoint}`;

describe('API client', () => {
	let api: API_TEST;

	beforeAll(() => {
		console.error = jest.fn();
	});

	beforeEach(() => {
		api = new API(host, port);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should set token to undefined', () => {
		expect(api.token).toBeUndefined();
	});

	it('should set correct baseURL without  port', () => {
		const _api = new API('test.com');

		expect(_api.baseURL).toBe('https://test.com/api');
	});

	it.each(authorizedAPIMethodsName.filter(e => e !== 'validateToken'))('should show error if no token is set (%s)', async(method) => {
		expect(() => api[method]()).toThrow('Validation token is not set');
	});

	describe('Login', () => {
		it('should send login credentials', async() => {
			const url = getUrl('login');
			const user = 'admin';
			const pass = 'admin';

			mockFetchResponse();

			await api.login(user, pass);

			expect(fetch).toHaveBeenCalledWith(url, {
				body: `{"username":"${user}","password":"${pass}"}`,
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'post'
			});
		});

		it('should save token whith correct credentials', async() => {
			const token = '9w83ru37yw3r';

			mockFetchResponse<CMLogin>({ token });

			await api.login('', '');

			expect(api.token).toBeDefined();
			expect(api.token).toEqual(token);
		});
	});

	describe('Calls with validation token', () => {
		const token = 'xxxxxxxxxxxxxxxxxxxx';

		beforeEach(async() => {
			mockFetchResponse<CMLogin>({ token });

			await api.login('', '');
		});

		const getHeader = makeGetRequest(token);

		describe('Validate', () => {
			it('should send validation tooken', async() => {
				const url = getUrl('validate');

				mockFetchResponse();

				await api.validateToken();

				expect(fetch).toHaveBeenCalledWith(url, getHeader);

			});

			it('should validate saved token (valid token)', async() => {
				mockFetchResponse();

				const tokenIsValid = await api.validateToken();

				expect(tokenIsValid).toBe(true);
			});

			it('should validate saved token (invalid token)', async() => {
				const error = 'invalid token';

				mockFetchResponse(undefined, 'KO', error);

				const tokenIsValid = await api.validateToken();

				expect(console.error).toHaveBeenCalledWith(error);
				expect(tokenIsValid).toBe(false);
			});
		});

		describe('showBy', () => {
			const urls = [
				getUrl('customers'),
				getUrl('tickets'),
				getUrl('products'),
				getUrl('services')
			];

			const testCasesWithoutQuery = authorizedAPIShowByMethodsName
				.map((e: string, i: number): [string, string] => [e, urls[i]]);

			it.each(testCasesWithoutQuery)('should make the correct call without query (%s)', async(method: string, url: string) => {
				mockFetchResponse();

				await api[method]({});

				expect(fetch).toHaveBeenCalledWith(url, getHeader);
			});

			const customerQuery: CustomerQuery = {
				name: 's',
				phone: '5'
			};

			const ticketQuery: TicketQuery = {
				customer: 'ie9e7eye6e',
				datemin: new Date('1-1-1970')
			};

			const productQuery: TaxableQuery = {
				name: 'product name',
				pricemax: 100
			};

			const serviceQuery: TaxableQuery = {
				name: 'service name',
				pricemin: 5
			};

			const _testCasesWithQuery: [CMQuery, string][] = [
				[customerQuery, `${urls[0]}?name=${customerQuery.name}&phone=${customerQuery.phone}`],
				[ticketQuery, `${urls[1]}?customer=${ticketQuery.customer}&datemin=${ticketQuery.datemin?.getTime()}`],
				[productQuery, `${urls[2]}?name=${productQuery.name ? encodeURIComponent(productQuery.name) : ''}&pricemax=${productQuery.pricemax}`],
				[serviceQuery, `${urls[3]}?name=${serviceQuery.name ? encodeURIComponent(serviceQuery.name) : ''}&pricemin=${serviceQuery.pricemin}`]
			];

			const testCasesWithQuery: [string, CMQuery, string][] = authorizedAPIShowByMethodsName
				.map((e: string, i: number): [string, CMQuery, string] => [e, ..._testCasesWithQuery[i]]);

			it.each(testCasesWithQuery)('should make the correct call with query (%s)', async(method: string, query: CMQuery, expectedUrlCall: string) => {
				mockFetchResponse();

				await api[method](query);

				expect(fetch).toHaveBeenCalledWith(expectedUrlCall, getHeader);
			});

			describe('showCustomersBy', () => {
				const customerListsCases: CustomerListElement[][][] = [
					[[]],
					[
						[
							{
								name: 'Gary',
								surname: 'Stu',
								phone: '555020103',
								email: '',
								observations: 'Very charimatic',
								_id: 't6we5rw7ey'
							},
							{
								name: 'Mary',
								surname: 'Su',
								phone: '555349866',
								email: 'mary.su@mail.mail',
								observations: 'Everyone loves her',
								_id: 's9d8dk3l3o'
							}
						]
					]
				];

				it.each(customerListsCases)('should return the correct data (%#)', async(customerList: CustomerListElement[]) => {
					mockFetchResponse<CustomerListElement[]>(customerList);

					const customerListResponse = await api.showCustomersBy({});

					expect(customerListResponse).toStrictEqual(customerList);
				});
			});

			describe('showTicketsBy', () => {
				const ticketListsCases: TicketListElement[][][] = [
					[[]],
					[
						[
							{
								_id: 'bbmbbcgv4f45f29si',
								date: new Date(),
								customer: '9a8usd9asd66a7s5d',
								services: [],
								products: [
									{
										taxable: 'o5w6wiuioiu42tu32',
										price: 100,
										quantity: 2,
										tax: 10
									}
								],
								total: {
									withTax: 220,
									withoutTax: 200
								}
							},
							{
								_id: 'bbmo9jnvcds4353odfti',
								date: new Date(),
								customer: '93ie7y46tr22qq',
								services: [
									{
										taxable: '99i3e8u3r7y46tkk',
										price: 20,
										quantity: 1,
										tax: 15
									},
									{
										taxable: '4r5tdfd9i4bvb38',
										price: 15,
										quantity: 1,
										tax: 15
									}
								],
								products: [],
								total: {
									withTax: 35,
									withoutTax: 40.25
								}
							}
						]
					]
				];

				it.each(ticketListsCases)('should return the correct data (%#)', async(tickets: Ticket[]) => {
					mockFetchResponse<Ticket[]>(tickets);

					const ticketsResponse = await api.showTicketsBy({});

					expect(ticketsResponse).toStrictEqual(tickets);
				});
			});

			describe('showProductsBy', () => {
				const productListsCases: TaxableListElement[][][] = [
					[[]],
					[
						[
							{
								_id: '987089ujjfrdrdrdrd',
								name: 'Product A',
								price: 50,
								tax: 10
							},
							{
								_id: '6t5r4e3w9iu8',
								name: 'Product B',
								price: 70,
								tax: 10
							}
						]
					]
				];

				it.each(productListsCases)('should return the correct data (%#)', async(producst: TaxableListElement[]) => {
					mockFetchResponse<TaxableListElement[]>(producst);

					const producstResponse = await api.showProductsBy({});

					expect(producstResponse).toStrictEqual(producst);
				});
			});

			describe('showServicesBy', () => {
				const serviceListsCases: TaxableListElement[][][] = [
					[[]],
					[
						[
							{
								_id: 'r8t68gr6fx8ry68gdx68rg',
								name: 'Service A',
								price: 25,
								tax: 15
							},
							{
								_id: 'lkajsdiwr09rjqawjf984toi76gf8d6',
								name: 'Service B',
								price: 20,
								tax: 15
							}
						]
					]
				];

				it.each(serviceListsCases)('should return the correct data (%#)', async(producst: TaxableListElement[]) => {
					mockFetchResponse<TaxableListElement[]>(producst);

					const producstResponse = await api.showServicesBy({});

					expect(producstResponse).toStrictEqual(producst);
				});
			});
		});

		describe('show, delete, modify & create', () => {
			const ids = [
				'iuey7rwy3nwke7fsiufs',
				'n46m3n4m6n89a8s89da',
				'9fd3iejmda5f8jfnq',
				'774ussnskoghgytn4n4'
			];

			const _urls = [
				getUrl('customer'),
				getUrl('ticket'),
				getUrl('service'),
				getUrl('product')
			];

			const urls = _urls.map((url, i) => `${url}/${ids[i]}`);

			describe('show & delete', () => {
				const mapper = (e: string, i: number): [string, string, string] => [e, ids[i], urls[i]];

				const callTest = (header: RequestInit) => async(method: string, id: string, url: string) => {
					mockFetchResponse();

					await api[method](id);

					expect(fetch).toHaveBeenCalledWith(url, header);
				};

				describe('show', () => {
					const testCasesCall = authorizedAPIShowMethodsName.map(mapper);

					it.each(testCasesCall)('should make the correct call (%s)', callTest(getHeader));

					it('should return the correct data (showCustomer)', async() => {
						const customer: Customer = {
							name: 'Zacarías',
							surname: 'Zack',
							phone: '987654132',
							email: 'zaza@mail.com',
							observations: 'Likes ZZ top'
						};

						mockFetchResponse<Customer>(customer);

						const customerRespopnse = await api.showCustomer(ids[0]);

						expect(customerRespopnse).toStrictEqual(customer);
					});

					it('should return the correct data (showTicket)', async() => {
						const ticket: Ticket = {
							date: new Date(),
							customer: 'iuey7rwy3nwke7fsiufs',
							services: [
								{
									taxable: '84urjfvnfs4669jsfdt46',
									price: 20,
									quantity: 1,
									tax: 15
								}
							],
							products: [
								{
									taxable: '84u5wsodojfsie842',
									price: 15,
									quantity: 1,
									tax: 15
								}
							],
							total: {
								withTax: 35,
								withoutTax: 40.25
							}
						};

						mockFetchResponse<Ticket>(ticket);

						const ticketRespopnse = await api.showTicket(ids[1]);

						expect(ticketRespopnse).toStrictEqual(ticket);
					});

					it('should return the correct data (showService)', async() => {
						const service: Taxable = {
							name: 'Extra Service',
							price: 5,
							tax: 15
						};

						mockFetchResponse<Taxable>(service);

						const serviceRespopnse = await api.showService(ids[2]);

						expect(serviceRespopnse).toStrictEqual(service);
					});

					it('should return the correct data (showProduct)', async() => {
						const product: Taxable = {
							name: 'Prime product',
							price: 500,
							tax: 25
						};

						mockFetchResponse<Taxable>(product);

						const productRespopnse = await api.showProduct(ids[3]);

						expect(productRespopnse).toStrictEqual(product);
					});
				});

				describe('delete', () => {
					const testCases = authorizedAPIDeleteMethodsName.map(mapper);

					it.each(testCases)('should make the correct call (%s)', callTest(makeRequest('delete', token)));

					it.each(testCases)('should return void (%s)', async(method: string, id: string) => {
						mockFetchResponse();

						const response = await api[method](id);

						expect(response).toBeUndefined();
					});
				});
			});

			describe('modify & create', () => {
				type DAT = Customer | Partial<Pick<Ticket, 'products' | 'services'>> | Taxable;

				const customer: Customer = {
					name: 'Zacarías',
					surname: 'Zack',
					phone: '987654132',
					email: 'zaza@mail.com',
					observations: 'Likes ZZ top'
				};

				const ticket: Partial<Pick<Ticket, 'products' | 'services'>> = {
					services: [
						{
							taxable: '84urjfvnfs4669jsfdt46',
							price: 20,
							quantity: 1,
							tax: 15
						}
					],
					products: [
						{
							taxable: '84u5wsodojfsie842',
							price: 15,
							quantity: 1,
							tax: 15
						}
					]
				};

				const service: Taxable = {
					name: 'Extra Service',
					price: 5,
					tax: 15
				};

				const product: Taxable = {
					name: 'Prime product',
					price: 500,
					tax: 25
				};

				const tData: DAT[] = [
					customer,
					ticket,
					service,
					product
				];

				describe('modify', () => {
					const testCases = authorizedAPIModifyMethodsName
						.map((e: string, i: number): [string, string, DAT, string] => [e, ids[i], tData[i], urls[i]]);

					it.each(testCases)('should make the correct call (%s)', async(method: string, id: string, data: DAT, url: string) => {
						mockFetchResponse();

						await api[method](id, data);

						expect(fetch).toHaveBeenCalledWith(url, makeRequestBody('put', token, data));
					});

					it.each(testCases)('should return void (%s)', async(method: string, id: string, data: DAT) => {
						mockFetchResponse();

						const response = await api[method](id, data);

						expect(response).toBeUndefined();
					});
				});

				describe('create', () => {
					const testCases = authorizedAPICreateMethodsName
						.map((e: string, i: number): [string, DAT, string] => [e, tData[i], _urls[i]]);

					it.each(testCases)('should make the correct call (%s)', async(method: string, data: DAT, url: string) => {
						mockFetchResponse();

						await api[method](data);

						expect(fetch).toHaveBeenCalledWith(url, makeRequestBody('post', token, data));
					});

					it.each(testCases)('should return void (%s)', async(method: string, data: DAT) => {
						mockFetchResponse();

						const response = await api[method](data);

						expect(response).toBeUndefined();
					});
				});
			});
		});
	});
});
