import { connect, clearDatabase, closeDatabase, ValidationError, isTrimmed } from '../test-utils';
import { Customer, User, Product, Service, Ticket } from '../../src/models/';

describe('Models', () => {
	beforeAll(async() => {
		await connect();
	});

	afterEach(async() => {
		await clearDatabase();
	});

	afterAll(async() => {
		await closeDatabase();
	});

	describe('User', () => {
		describe('Validation', () => {
			it('should check for required fields', () => {
				const user = new User();

				user.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.username).toBeDefined();
					expect(error.errors?.password).toBeDefined();
				});
			});

			it('should no allow inner spaces in username and password', () => {
				const dataA = {
					username: 'Flower flow',
					password: 'fl0wer 1234'
				};

				const dataB = {
					username: 'Oildaa\nBiashumin',
					password: 'qwerty\n123456'
				};

				const userA = new User(dataA);
				const userB = new User(dataB);

				userA.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.username).toBeDefined();
					expect(error.errors?.password).toBeDefined();
				});

				userB.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.username).toBeDefined();
					expect(error.errors?.password).toBeDefined();
				});
			});

			it('should not create duplicate username', async() => {
				const username = 'Bloodsplat';
				const userA = new User({ username, password: 'q1w2e3r4t5y6' });
				const userB = new User({ username, password: '1q2w3e4r5t6y' });

				await userA.save();

				return expect(() => userB.save()).rejects.toThrow(ValidationError);
			});
		});

		describe('Tranformations', () => {
			const data = {
				username: '  Flowerflow  ',
				password: 'fl0wer1234   '
			};

			let document;

			beforeAll(async() => {
				document = await new User(data).save();
			});

			it('should trim username and password', () => {
				expect(isTrimmed(document.username)).toBe(true);
				expect(isTrimmed(document.password)).toBe(true);
			});

			it('should uppercase username', () => {
				expect(document.username).toBe('FLOWERFLOW');
			});
		});
	});

	describe('Customer', () => {
		describe('Validation', () => {
			it('should check for required fields', () => {
				const customer = new Customer();

				customer.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.name).toBeDefined();
					expect(error.errors?.surname).toBeDefined();
					expect(error.errors?.phone).toBeDefined();
				});
			});

			it('should not create duplicate phone numbers', async() => {
				const phone = '100200300';
				const customerA = new Customer({ name: 'Sconnear', surname: 'Pitchforkplanter', phone });
				const customerB = new Customer({ name: 'Muquuviam', surname: 'Addalynne', phone });

				await customerA.save();

				return expect(() => customerB.save()).rejects.toThrow(ValidationError);
			});

			it('should have all properties set', async() => {
				const data = {
					name: 'Jerry',
					surname: 'Tsok',
					phone: '999888777',
					email: 'jerry.tosk@testemal.email',
					observations: 'Interesting observation',
					hide: true
				};

				const document = await new Customer(data).save();

				for (const [key, value] of Object.entries(data)) {
					expect(document[key]).toBe(value);
				}
			});

		});

		describe('Default values', () => {
			const data = {
				name: 'Pandei',
				surname: 'Ramjet',
				phone: '777444111'
			};

			let document;

			beforeAll(async() => {
				document = await new Customer(data).save();
			});

			it('should set observations as empty string', () => {
				expect(document.observations).toBeDefined();
				expect(document.observations).toBe('');
			});

			it('should set hide to false', () => {
				expect(document.hide).toBeDefined();
				expect(document.hide).toBe(false);
			});

			it('should not set a default email', () => {
				expect(document.email).toBeUndefined();
			});
		});

		describe('Tranformations', () => {
			const data = {
				name: 'Younghou  ',
				surname: '  Uxuug',
				phone: '  777555333 ',
				email: ' Younghou.Uxuug@EMAIL.EMAIL '
			};

			let document;

			beforeAll(async() => {
				document = await new Customer(data).save();
			});

			it('should trim values', () => {
				expect(isTrimmed(document.name)).toBe(true);
				expect(isTrimmed(document.surname)).toBe(true);
				expect(isTrimmed(document.phone)).toBe(true);
				expect(isTrimmed(document.email)).toBe(true);
			});

			it('should lowercase email', () => {
				expect(document.email).toBe('younghou.uxuug@email.email');
			});
		});
	});

	describe('Product', () => {
		describe('Validation', () => {
			it('should check for required fields', () => {
				const product = new Product();

				product.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.name).toBeDefined();
					expect(error.errors?.price).toBeDefined();
					expect(error.errors?.tax).toBeDefined();
				});
			});

			it('should not create duplicate name', async() => {
				const name = 'Product Name';
				const price = 20;
				const tax = 10;
				const productA = new Product({ name, price, tax });
				const productB = new Product({ name, price, tax });

				await productA.save();

				return expect(() => productB.save()).rejects.toThrow(ValidationError);
			});

			it('should have all properties set', async() => {
				const name = 'SUPER PRODUCT';
				const price = 50;
				const tax = 15;

				const document = await new Product({ name, price, tax, hide: true }).save();

				expect(document.name).toBe(name);
				expect(document.price).toBe(price);
				expect(document.tax).toBe(tax);
				expect(document.hide).toBe(true);
			});

			it('should not allow price and tax below zero', () => {
				const name = 'Mega product';
				const price = -100;
				const tax = -25;

				const product = new Product({ name, price, tax });

				product.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.price).toBeDefined();
					expect(error.errors?.tax).toBeDefined();
				});
			});
		});

		describe('Default values', () => {
			it('should set hide to false', async() => {
				const data = {
					name: 'GIGA product',
					price: '200',
					tax: '21'
				};
				const document = await new Product(data).save();

				expect(document.hide).toBeDefined();
				expect(document.hide).toBe(false);
			});
		});

		describe('Tranformations', () => {
			it('should trim values product name', async() => {
				const data = {
					name: '   ULTRA product   ',
					price: '250',
					tax: '25'
				};

				const document = await new Product(data).save();

				expect(isTrimmed(document.name)).toBe(true);
			});
		});
	});

	describe('Service', () => {
		describe('Validation', () => {
			it('should check for required fields', () => {
				const service = new Service();

				service.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.name).toBeDefined();
					expect(error.errors?.price).toBeDefined();
					expect(error.errors?.tax).toBeDefined();
				});
			});

			it('should not create duplicate name', async() => {
				const name = 'Service Name';
				const price = 20;
				const tax = 10;
				const serviceA = new Service({ name, price, tax });
				const serviceB = new Service({ name, price, tax });
				const message = 'Service validation failed: name: Error, expected `name` to be unique. Value: `SERVICE NAME`';

				await serviceA.save();

				return expect(() => serviceB.save()).rejects.toMatchObject({ message });
			});

			it('should have all properties set', async() => {
				const name = 'SUPER SERVICE';
				const price = 50;
				const tax = 15;

				const document = await new Service({ name, price, tax, hide: true }).save();

				expect(document.name).toBe(name);
				expect(document.price).toBe(price);
				expect(document.tax).toBe(tax);
				expect(document.hide).toBe(true);
			});

			it('should not allow price and tax below zero', () => {
				const name = 'Mega service';
				const price = -100;
				const tax = -25;

				const service = new Service({ name, price, tax });

				service.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.price).toBeDefined();
					expect(error.errors?.tax).toBeDefined();
				});
			});
		});

		describe('Default values', () => {
			it('should set hide to false', async() => {
				const data = {
					name: 'GIGA service',
					price: '200',
					tax: '21'
				};
				const document = await new Service(data).save();

				expect(document.hide).toBeDefined();
				expect(document.hide).toBe(false);
			});
		});

		describe('Tranformations', () => {
			it('should trim values service name', async() => {
				const data = {
					name: '   ULTRA service   ',
					price: '250',
					tax: '25'
				};
				const document = await new Service(data).save();

				expect(isTrimmed(document.name)).toBe(true);
			});
		});
	});

	describe('Ticket', () => {
		describe('Validation', () => {
			it('should check for required fields', () => {
				const ticket = new Ticket();

				ticket.validate(error => {
					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.customer).toBeDefined();
					expect(error.errors?.['total.withTax']).toBeDefined();
					expect(error.errors?.['total.withoutTax']).toBeDefined();
				});
			});

			it('should validate products and services', async() => {
				const message = 'services and products can not be empty at the same time';
				const customer = '6092f767bc1a9116ec3d29a3';
				const total = {
					withoutTax: '10',
					withTax: '15'
				};
				const ticketA = new Ticket({ customer, total, products: [{}], services: [{}] });

				ticketA.validate(error => {
					const pathProducts = 'products.0.';
					const pathPervices = 'services.0.';

					expect(error instanceof ValidationError).toBe(true);
					expect(error.errors?.[pathProducts + 'taxable']).toBeDefined();
					expect(error.errors?.[pathProducts + 'price']).toBeDefined();
					expect(error.errors?.[pathProducts + 'quantity']).toBeDefined();
					expect(error.errors?.[pathProducts + 'tax']).toBeDefined();
					expect(error.errors?.[pathPervices + 'taxable']).toBeDefined();
					expect(error.errors?.[pathPervices + 'price']).toBeDefined();
					expect(error.errors?.[pathPervices + 'quantity']).toBeDefined();
					expect(error.errors?.[pathPervices + 'tax']).toBeDefined();
				});

				const ticketB = new Ticket({ customer, total });

				return expect(() => ticketB.save()).rejects.toMatchObject({ message });
			});
		});

		describe('Default values', () => {
			it('should set date', async() => {
				const customer = '6092f767bc1a9116ec3d29a3';
				const products = [{
					taxable: '60980d0e2841f10a98096cb4',
					price: '10',
					tax: '10',
					quantity: '2'
				}];
				const total = {
					withoutTax: '20',
					withTax: '22'
				};
				const document = await new Ticket({ customer, total, products }).save();

				expect(document.date).toBeDefined();
				expect(Date.parse(document.date)).not.toBeNaN();
			});
		});
	});
});
