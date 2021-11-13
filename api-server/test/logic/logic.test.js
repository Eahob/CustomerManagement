import { connect, clearDatabase, closeDatabase, ValidationError, ObjectId as objectId } from '../test-utils';
import { Customer, Product, Service, Ticket, User } from '../../src/models/';
import {
	login,
	createUser,
	createCustomer,
	createProduct,
	createService,
	createTicket,
	editCustomer,
	editService,
	editProduct,
	editTicket,
	deleteCustomer,
	deleteService,
	deleteProduct,
	deleteTicket,
	findProductsBy,
	findServicesBy,
	findCustomersBy,
	findTicketsBy,
	showCustomer,
	showProduct,
	showService,
	showTicket
} from '../../src/logic/';

describe('Logic tests', () => {
	beforeAll(async() => {
		await connect();
	});

	afterEach(async() => {
		await clearDatabase();
	});

	afterAll(async() => {
		await closeDatabase();
	});

	describe('login', () => {
		const username = 'username';
		const password = 'password';
		const loginError = Error('Username and/or password wrong');
		let document;

		beforeEach(async() => {
			await new User({ username: 'admin', password }).save();
			document = await new User({ username, password }).save();
		});

		it('should get user with the correct password', async() => {
			await expect(login(username, password)).resolves.toEqual(document._id);
		});

		it('should not get user with incorrect password', async() => {
			await expect(() => login(username, '123456')).rejects.toThrow(loginError);
		});

		it('should not get users with incorrect username', async() => {
			await expect(() => login('fakeuser', '987654')).rejects.toThrow(loginError);
		});

		it('should not get users with incorrect username (and existing password)', async() => {
			await expect(() => login('fakeuser', password)).rejects.toThrow(loginError);
		});

		it('should not be able to inject NoSQL queries', async() => {
			const dataJSONA = `{
				"username": {"$ne":1},
				"password": {"$ne":1}
			}`;

			const dataJSONB = `{
				"username": {"$gt":""},
				"password": {"$gt":""}
			}`;

			const dataA = JSON.parse(dataJSONA);
			const dataB = JSON.parse(dataJSONB);

			await expect(() => login(dataA.username, dataA.password)).rejects.toThrow(loginError);
			await expect(() => login(dataB.username, dataB.password)).rejects.toThrow(loginError);
		});
	});

	describe('Create', () => {
		it('should create an user', async() => {
			const data = {
				username: 'admin',
				password: 'passw'
			};

			await createUser(data);

			await expect(User.findOne(data)).resolves.not.toBeNull();
		});

		it('should create a customer', async() => {
			const data = {
				name: 'Name',
				surname: 'Surname',
				phone: '987456132',
				email: 'email@email.email'
			};

			await createCustomer(data);

			await expect(Customer.findOne(data)).resolves.not.toBeNull();
		});

		it('should create a product', async() => {
			const data = {
				name: 'product name',
				price: '20',
				tax: '5'
			};

			await createProduct(data);

			await expect(Product.findOne(data)).resolves.not.toBeNull();
		});

		it('should create a service', async() => {
			const data = {
				name: 'service name',
				price: '20',
				tax: '5'
			};

			await createService(data);

			await expect(Service.findOne(data)).resolves.not.toBeNull();
		});

		it('should create a ticket', async() => {
			const customerData = {
				name: 'Eman',
				surname: 'Emanrus',
				phone: '159267384',
				email: 'eman@email.email'
			};

			const serviceAData = {
				name: 'Service A',
				price: '20',
				tax: '5'
			};

			const serviceBData = {
				name: 'Service B',
				price: '30',
				tax: '10'
			};

			const productAData = {
				name: 'Product A',
				price: '15',
				tax: '10'
			};

			const productBData = {
				name: 'Product B',
				price: '40',
				tax: '20'
			};

			const customer = await (new Customer(customerData)).save();
			const serviceA = await (new Service(serviceAData)).save();
			const serviceB = await (new Service(serviceBData)).save();
			const productA = await (new Product(productAData)).save();
			const productB = await (new Product(productBData)).save();

			const ticketData = {
				customer: customer._id,
				servicesList: [
					{
						id: serviceA._id,
						quantity: 1
					},
					{
						id: serviceB._id,
						quantity: 2
					}
				],
				productsList: [
					{
						id: productA._id,
						quantity: 3
					},
					{
						id: productB._id,
						quantity: 4
					}
				]
			};

			const ticket = await createTicket(ticketData);

			const expectedTotalWithoutTax = 285;
			const expectedTotalWithTax = 328.5;

			expect(ticket.customer.equals(customer._id)).toBe(true);
			expect(ticket.total.withoutTax).toBe(expectedTotalWithoutTax);
			expect(ticket.total.withTax).toBe(expectedTotalWithTax);
			expect(ticket.services).toHaveLength(ticketData.servicesList.length);
			expect(ticket.products).toHaveLength(ticketData.productsList.length);
			ticket.services.forEach(({ taxable, quantity }, index) => {
				expect(taxable.equals(ticketData.servicesList[index].id)).toBe(true);
				expect(quantity).toBe(ticketData.servicesList[index].quantity);
			});
			ticket.products.forEach(({ taxable, quantity }, index) => {
				expect(taxable.equals(ticketData.productsList[index].id)).toBe(true);
				expect(quantity).toBe(ticketData.productsList[index].quantity);
			});
		});
	});

	describe('Edit', () => {
		it.each([
			['editCustomer', editCustomer],
			['editService', editService],
			['editProduct', editProduct]
		])('%s shold throw error if no id is passed', async(_, eidtCB) => {
			await expect(() => eidtCB({})).rejects.toThrow('Need id to edit');
		});

		describe('No repeated values', () => {
			const editHelper = (Model, data, callback) => async(key, newValue) => {
				const document = await (new Model(data)).save();
				const id = document.id;

				await callback({ [key]: newValue }, id);
				const editedDocument = await Model.findById(id);

				expect(editedDocument[key]).not.toBe(data[key]);
				expect(editedDocument[key].toString()).toBe(newValue);
			};

			describe('Customer', () => {
				const customerData = {
					name: 'Dazzlemint',
					surname: 'Beetlefrost',
					phone: '789456123',
					email: 'mint@email.email'
				};

				it.each([
					['name', 'Geixuo'],
					['surname', 'Cacklegnash'],
					['phone', '789456122'],
					['email', 'geixo@email.email'],
					['observations', 'Likes hair pink']
				])('should edit %s', editHelper(Customer, customerData, editCustomer));
			});

			describe('Service', () => {
				const serviceData = {
					name: 'top service',
					price: 200,
					tax: 15
				};

				it.each([
					['name', 'MEGA SERVICE'],
					['price', '300'],
					['tax', '20']
				])('should edit %s', editHelper(Service, serviceData, editService));
			});

			describe('Product', () => {
				const productData = {
					name: 'top product',
					price: 250,
					tax: 5
				};

				it.each([
					['name', 'MEGA PRODUCT'],
					['price', '400'],
					['tax', '25']
				])('should edit %s', editHelper(Product, productData, editProduct));
			});
		});

		describe('Repeated values', () => {
			describe('Customer', () => {
				let customerId;
				const phone = '147896325';
				const customerDataA = {
					name: 'Hajaat',
					surname: 'Smokescreen',
					phone
				};
				const customerDataB = {
					name: 'Sandstorm',
					surname: 'Gzitok',
					phone: '523698741'
				};

				beforeEach(async() => {
					await new Customer(customerDataA).save();
					const customer = await (new Customer(customerDataB)).save();

					customerId = customer.id;
				});

				it('should throw error editing repeated phone', async() => {
					await expect(() => editCustomer({ phone }, customerId)).rejects.toThrow(ValidationError);
				});
			});

			describe('Service', () => {
				let serviceId;
				const name = 'Cool Service';
				const serviceDataA = {
					name,
					price: 50,
					tax: 10
				};
				const serviceDataB = {
					name: 'OK service',
					price: 60,
					tax: 10
				};

				beforeEach(async() => {
					await new Service(serviceDataA).save();
					const service = await (new Service(serviceDataB)).save();

					serviceId = service.id;
				});

				it('should throw error editing repeated name', async() => {
					await expect(() => editService({ name }, serviceId)).rejects.toThrow(ValidationError);
				});
			});

			describe('Product', () => {
				let productId;
				const name = 'Cool Product';
				const productDataA = {
					name,
					price: 50,
					tax: 10
				};
				const productDataB = {
					name: 'OK product',
					price: 60,
					tax: 10
				};

				beforeEach(async() => {
					await new Product(productDataA).save();
					const product = await (new Product(productDataB)).save();

					productId = product.id;
				});

				it('should throw error editing repeated name', async() => {
					await expect(() => editProduct({ name }, productId)).rejects.toThrow(ValidationError);
				});
			});
		});

		describe('Ticket', () => {
			it('should edit a ticket', async() => {
				const customerData = {
					name: 'Cust',
					surname: 'Omer',
					phone: '861357429',
					email: 'cust@email.email'
				};

				const serviceAData = {
					name: 'Service A',
					price: '20',
					tax: '5'
				};

				const serviceBData = {
					name: 'Service B',
					price: '30',
					tax: '10'
				};

				const productAData = {
					name: 'Product A',
					price: '15',
					tax: '10'
				};

				const productBData = {
					name: 'Product B',
					price: '40',
					tax: '20'
				};

				const customer = await (new Customer(customerData)).save();
				const serviceA = await (new Service(serviceAData)).save();
				const serviceB = await (new Service(serviceBData)).save();
				const productA = await (new Product(productAData)).save();
				const productB = await (new Product(productBData)).save();

				const ticketData = {
					customer: customer._id,
					servicesList: [
						{
							id: serviceA._id,
							quantity: 1
						}
					],
					productsList: [
						{
							id: productA._id,
							quantity: 3
						}
					]
				};

				const ticket = await createTicket(ticketData);

				const editedTicketData = {
					servicesList: [
						{
							id: serviceB._id,
							quantity: 2
						}
					],
					productsList: [
						{
							id: productB._id,
							quantity: 2
						}
					]
				};

				await editTicket(editedTicketData, ticket._id);

				const editedTicket = await Ticket.findById(ticket._id);

				const expectedTotalWithoutTax = 140;
				const expectedTotalWithTax = 162;

				expect(editedTicket.customer.equals(customer._id)).toBe(true);
				expect(editedTicket.total.withoutTax).toBe(expectedTotalWithoutTax);
				expect(editedTicket.total.withTax).toBe(expectedTotalWithTax);
				expect(editedTicket.services).toHaveLength(editedTicketData.servicesList.length);
				expect(editedTicket.products).toHaveLength(editedTicketData.productsList.length);
				editedTicket.services.forEach(({ taxable, quantity }, index) => {
					expect(taxable.equals(editedTicketData.servicesList[index].id)).toBe(true);
					expect(quantity).toBe(editedTicketData.servicesList[index].quantity);
				});
				editedTicket.products.forEach(({ taxable, quantity }, index) => {
					expect(taxable.equals(editedTicketData.productsList[index].id)).toBe(true);
					expect(quantity).toBe(editedTicketData.productsList[index].quantity);
				});
			});
		});
	});

	describe('Delete (Hide)', () => {
		it('should hide customer, not delete it from the database', async() => {
			const data = {
				name: 'Tsuc',
				surname: 'Remo',
				phone: '751842963'
			};

			const customer = await (new Customer(data)).save();

			const id = customer.id;

			await deleteCustomer(id);

			const customerDeletet = await Customer.findById(id);

			expect(customerDeletet).not.toBeNull();
			expect(customerDeletet.hide).toBe(true);
		});

		it('should hide service, not delete it from the database', async() => {
			const data = {
				name: 'Outdated Service',
				price: '12',
				tax: '21'
			};

			const service = await (new Service(data)).save();

			const id = service.id;

			await deleteService(id);

			const serviceDelet = await Service.findById(id);

			expect(serviceDelet).not.toBeNull();
			expect(serviceDelet.hide).toBe(true);
		});

		it('should hide product, not delete it from the database', async() => {
			const data = {
				name: 'Outdated Product',
				price: '12',
				tax: '21'
			};

			const product = await (new Product(data)).save();

			const id = product.id;

			await deleteProduct(id);

			const productDelet = await Product.findById(id);

			expect(productDelet).not.toBeNull();
			expect(productDelet.hide).toBe(true);
		});

		it('should delete ticket', async() => {
			const customerData = {
				name: 'Eman',
				surname: 'Emanrus',
				phone: '159267384',
				email: 'eman@email.email'
			};

			const serviceData = {
				name: 'Service',
				price: '20',
				tax: '5'
			};

			const customer = await (new Customer(customerData)).save();
			const service = await (new Service(serviceData)).save();

			const ticketData = {
				customer: customer._id,
				servicesList: [
					{
						id: service._id,
						quantity: 1
					}
				]
			};

			const ticket = await createTicket(ticketData);

			const id = ticket.id;

			await deleteTicket(id);

			await expect(Ticket.findById(id)).resolves.toBeNull();
		});
	});

	describe('Filter', () => {
		const projection = { __v: 0, hide: 0 };

		const taxableCases = [
			[{}, { hide: false }],
			[{
				pricemin: 10,
				pricemax: 30,
				name: 'name'
			},
			{
				hide: false,
				name: {
					$regex: 'NAME'
				},
				price: {
					$gte: 10,
					$lte: 30
				}
			}],
			[{
				pricemax: 30,
				name: 'name'
			},
			{
				hide: false,
				name: {
					$regex: 'NAME'
				},
				price: {
					$lte: 30
				}
			}],
			[{
				pricemin: 10,
				name: 'name'
			},
			{
				hide: false,
				name: {
					$regex: 'NAME'
				},
				price: {
					$gte: 10
				}
			}],
			[{
				name: 'name'
			},
			{
				hide: false,
				name: {
					$regex: 'NAME'
				}
			}],
			[{
				pricemin: 10,
				pricemax: 30
			},
			{
				hide: false,
				price: {
					$gte: 10,
					$lte: 30
				}
			}],
			[{
				pricemin: 10
			},
			{
				hide: false,
				price: {
					$gte: 10
				}
			}],
			[{
				pricemax: 30
			},
			{
				hide: false,
				price: {
					$lte: 30
				}
			}]
		];

		describe('Product', () => {
			const spy = jest.spyOn(Product, 'find');

			afterAll(() => {
				spy.mockRestore();
			});

			it.each(taxableCases)('should call find with the correct filter', async(options, expectedResult) => {
				await findProductsBy(options);

				expect(spy).toHaveBeenCalledWith(expectedResult, projection);
			});
		});

		describe('Service', () => {
			const spy = jest.spyOn(Service, 'find');

			afterAll(() => {
				spy.mockRestore();
			});

			it.each(taxableCases)('should call find with the correct filter', async(options, expectedResult) => {
				await findServicesBy(options);

				expect(spy).toHaveBeenCalledWith(expectedResult, projection);
			});
		});

		describe('Customers', () => {
			const customerCases = (customerData => {
				const BASE_TWO = 2;
				const result = [];
				const list = Object.keys(customerData);
				const total = Math.pow(BASE_TWO, list.length);

				for (let n = 0; n < total; n++) {
					result[n] = [{}, { hide: false }];

					n.toString(BASE_TWO).split('').reverse().forEach((bit, index) => {
						if (bit === '1') {
							const key = list[index];

							result[n][0][key] = customerData[key];
							result[n][1][key] = { $regex: new RegExp(customerData[key], 'i') };
						}
					});
				}

				return result;
			})({
				name: 'Name',
				surname: 'Surname',
				phone: '987456132',
				email: 'email@email.email',
				observations: 'Some thing'
			});

			const spy = jest.spyOn(Customer, 'find');

			afterAll(() => {
				spy.mockRestore();
			});

			it.each(customerCases)('should call find with the correct filter', async(options, expectedResult) => {
				await findCustomersBy(options);

				expect(spy).toHaveBeenCalledWith(expectedResult, projection);
			});
		});

		describe('Ticket', () => {
			describe('Filter', () => {
				const id = objectId();
				const spy = jest.spyOn(Ticket, 'find');

				afterAll(() => {
					spy.mockRestore();
				});

				it.each([
					[{}, {}],
					[{ pricemax: 10 }, { 'total.withTax': { $lte: 10 } }],
					[{ pricemin: 5 }, { 'total.withTax': { $gte: 5 } }],
					[{ pricemin: 5, pricemax: 10 }, { 'total.withTax': { $lte: 10, $gte: 5 } }],
					[{ datemax: '2021-05-12' }, { date: { $lte: '2021-05-12' } }],
					[{ datemin: '2020-05-12' }, { date: { $gte: '2020-05-12' } }],
					[{ datemin: '2020-05-12', datemax: '2021-05-12' }, { date: { $lte: '2021-05-12', $gte: '2020-05-12' } }],
					[{ customerId: id }, { customer: id }]
				])('should call find with the correct filter', async(options, expectedResult) => {
					await findTicketsBy(options);

					expect(spy).toHaveBeenCalledWith(expectedResult, { __v: 0 });
				});
			});

			it('should populate ticket with customer name and surname', async() => {
				const customerData = {
					name: 'Eman',
					surname: 'Emanrus',
					phone: '159267384',
					email: 'eman@email.email'
				};

				const productData = {
					name: 'Product',
					price: '30',
					tax: '21'
				};

				const customer = await (new Customer(customerData)).save();
				const product = await (new Product(productData)).save();

				const ticketData = {
					customer: customer._id,
					productsList: [
						{
							id: product._id,
							quantity: 1
						}
					]
				};

				await createTicket(ticketData);

				const result = await findTicketsBy({});

				expect(result[0].customer.name).toBe(customerData.name);
				expect(result[0].customer.surname).toBe(customerData.surname);
			});
		});
	});

	describe('Show', () => {
		it.each([
			[Customer, showCustomer, objectId()],
			[Product, showProduct, objectId()],
			[Service, showService, objectId()],
			[Ticket, showTicket, objectId()]
		])('Should call findById', async(model, show, id) => {
			const spy = jest.spyOn(model, 'findById');

			await show(id);

			expect(spy).toHaveBeenCalledWith(id, { _id: 0, __v: 0, hide: 0 });

			spy.mockRestore();
		});

		it('Should populate ticket with customer name services name and products name correctly', async() => {
			const customerData = {
				name: 'Cust',
				surname: 'Omer',
				phone: '861357429',
				email: 'cust@email.email'
			};

			const serviceData = {
				name: 'Ecivres',
				price: '25',
				tax: '25'
			};

			const productData = {
				name: 'Tcudorp',
				price: '55',
				tax: '20'
			};

			const customer = await (new Customer(customerData)).save();
			const service = await (new Service(serviceData)).save();
			const product = await (new Product(productData)).save();

			const ticketData = {
				customer: customer._id,
				servicesList: [
					{
						id: service._id,
						quantity: 1
					}
				],
				productsList: [
					{
						id: product._id,
						quantity: 3
					}
				]
			};

			const ticket = await createTicket(ticketData);

			const result = await showTicket(ticket.id);

			expect(result.customer.name).toBe(customerData.name);
			expect(result.services[0].taxable.name).toBe(service.name);
			expect(result.products[0].taxable.name).toBe(product.name);

			expect(result.services[0]._id).toBeUndefined();
			expect(result.products[0]._id).toBeUndefined();
		});
	});
});
