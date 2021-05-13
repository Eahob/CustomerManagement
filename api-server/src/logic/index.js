import { Customer, Ticket, Service, Product, User } from '../models';

export function login(username, password) {
	return User.findOne({ username, password }, { _id: 1 }).then(res => {
		if (res) { return res._id; }

		throw Error('Username and/or password wrong');
	});
}

export function findCustomersBy({ name, surname, phone, email, observations }) {
	const filter = {};

	if (name) { filter.name = { $regex: new RegExp(name, 'i') }; }
	if (surname) { filter.surname = { $regex: new RegExp(surname, 'i') }; }
	if (phone) { filter.phone = { $regex: new RegExp(phone, 'i') }; }
	if (email) { filter.email = { $regex: new RegExp(email, 'i') }; }
	if (observations) { filter.observations = { $regex: new RegExp(observations, 'i') }; }

	filter.hide = false;

	return Customer.find(filter, { __v: 0, hide: 0 });
}

export function findTicketsBy({ pricemin, pricemax, datemin, datemax, customerId }) {
	const filter = {};

	if (pricemax || pricemin) {
		filter['total.withTax'] = {};
		if (pricemin) { filter['total.withTax']['$gte'] = pricemin; }
		if (pricemax) { filter['total.withTax']['$lte'] = pricemax; }
	}
	if (datemin || datemax) {
		filter.date = {};
		if (datemin) { filter.date['$gte'] = datemin; }
		if (datemax) { filter.date['$lte'] = datemax; }
	}
	if (customerId) { filter.customer = customerId; }

	return Ticket.find(filter, { __v: 0 }).sort([['date', -1]]).populate('customer', 'name surname');
}

export function findServicesBy({ pricemin, pricemax, name }) {
	const filter = {};

	if (pricemax || pricemin) {
		filter.price = {};
		if (pricemin) { filter.price['$gte'] = parseFloat(pricemin); }
		if (pricemax) { filter.price['$lte'] = parseFloat(pricemax); }
	}
	if (name) { filter.name = { $regex: new RegExp(name, 'i') }; }

	filter.hide = false;

	return Service.find(filter, { __v: 0, hide: 0 });
}

export function findProductsBy({ pricemin, pricemax, name }) {
	const filter = {};

	if (pricemax || pricemin) {
		filter.price = {};
		if (pricemin) { filter.price['$gte'] = parseFloat(pricemin); }
		if (pricemax) { filter.price['$lte'] = parseFloat(pricemax); }
	}
	if (name) { filter.name = { $regex: new RegExp(name, 'i') }; }

	filter.hide = false;

	return Product.find(filter, { __v: 0, hide: 0 });
}

export function createCustomer({ name, surname, phone, email, observations }) {
	return new Customer({ name, surname, phone, email, observations }).save();
}

export function createService({ name, price, tax }) {
	return new Service({ name, price, tax }).save();
}

export function createProduct({ name, price, tax }) {
	return new Product({ name, price, tax }).save();
}

function expandTaxableList(taxableList) {
	return document => {
		const index = taxableList.findIndex(taxable => taxable.id === document.id);

		return {
			document,
			quantity: taxableList[index].quantity
		};
	};
}

function calculateTax(model, taxableList) {
	const INITIAL_PRICE = 0;
	const taxableIdList = taxableList.map(taxable => taxable.id);

	return model
		.find({ _id: { $in: taxableIdList } })
		.then(documents => documents
			.map(expandTaxableList(taxableList))
			.reduce(({ withTax, withoutTax, description }, { document, quantity }) => {
				const taxable = document._id;
				const price = document.price;
				const tax = document.tax;
				const subTotal = price * quantity;

				description.push({ taxable, price, quantity, tax });

				return {
					withTax: withTax + (subTotal * (1 + (tax / 100))),
					withoutTax: withoutTax + subTotal,
					description
				};
			}, {
				withTax: INITIAL_PRICE,
				withoutTax: INITIAL_PRICE,
				description: []
			})
		);
}

function calculateTicket(services = [], products = []) {
	// services is an array. Each element has and id for the service and the quantity
	// products is an array. Each element has and id for the product and the quantity

	return Promise.all([
		calculateTax(Service, services),
		calculateTax(Product, products)
	])
		.then(([servicesResult, productResult]) => {
			const FIXED_POINTS_DIGIT = 2;
			const total = {
				withTax: (servicesResult.withTax + productResult.withTax).toFixed(FIXED_POINTS_DIGIT),
				withoutTax: (servicesResult.withoutTax + productResult.withoutTax).toFixed(FIXED_POINTS_DIGIT)
			};

			return {
				services: servicesResult.description,
				products: productResult.description,
				total
			};
		});
}

export const createTicket = async({ customer, servicesList, productsList }) => {
	const { services, products, total } = await calculateTicket(servicesList, productsList);

	return new Ticket({ date: Date(), customer, services, products, total }).save();
};

const hide = model => _id => model.findByIdAndUpdate(_id, { $set: { hide: true } });

export const deleteCustomer = hide(Customer);
export const deleteService = hide(Service);
export const deleteProduct = hide(Product);
export const deleteTicket = _id => Ticket.findOneAndDelete(_id);

const show = model => _id => model.findById(_id, { _id: 0, __v: 0, hide: 0 });

export const showCustomer = show(Customer);
export const showService = show(Service);
export const showProduct = show(Product);
export const showTicket = _id => Ticket.findById(_id, { _id: 0, __v: 0, hide: 0 })
	.populate('customer', 'name')
	.populate('services.service', 'name')
	.populate('products.product', 'name');

export function editCustomer({ name, surname, phone, email, observations }, _id) {
	return Customer.findById(_id)
		.then(customer => {
			for (const [key, value] of Object.entries({ name, surname, phone, email, observations })) {
				if (value !== undefined) {
					customer[key] = value;
				}
			}

			return customer.save();
		})
		.then(() => ({ _id }));
}

export function editTicket({ servicesList, productsList }, _id) {
	return Ticket.findById(_id)
		.then(ticket => {
			const { services, products, total } = calculateTicket(servicesList, productsList);

			ticket.services = services;
			ticket.products = products;
			ticket.total = total;

			return ticket.save();
		})
		.then(() => ({ _id }));
}

const editTaxable = model => async({ name, price, tax }, _id) => {
	const taxable = await model.findById(_id);

	for (const [key, value] of Object.entries({ name, price, tax })) {
		if (value !== undefined) {
			taxable[key] = value;
		}
	}

	await taxable.save();

	return { _id };
};

export const editService = editTaxable(Service);
export const editProduct = editTaxable(Product);
