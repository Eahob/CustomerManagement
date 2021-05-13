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

export function createTicket({ customer, servicesList, productsList }) {
	if (!(servicesList.length || productsList.length)) {
		throw Error('services and products can not be empty at the same time');
	}

	return calculateTicket(servicesList, productsList).then(({services, products, total}) => {
		const ticket = new Ticket({ date: Date(), customer, services, products, total });

		return ticket.save();
	});
}

export function deleteTicket(_id) {
	return Ticket.deleteOne({ _id });
}

export function deleteCustomer(_id) {
	//return Customer.deleteOne({ _id })
	return Customer.updateOne({ _id }, { $set: { hide: true } });
}

export function deleteService(_id) {
	//return Service.deleteOne({ _id })
	return Service.updateOne({ _id }, { $set: { hide: true } });
}

export function deleteProduct(_id) {
	//return Product.deleteOne({ _id })
	return Product.updateOne({ _id }, { $set: { hide: true } });
}

export function showCustomer(_id) {
	return Customer.findOne({ _id }, { _id: 0, __v: 0, hide: 0 });
}

export function showTicket(_id) {
	return Ticket.findOne({ _id }, { _id: 0, __v: 0, hide: 0 })
		.populate('customer', 'name')
		.populate('services.service', 'name')
		.populate('products.product', 'name');
}

export function showService(_id) {
	return Service.findOne({ _id }, { _id: 0, __v: 0, hide: 0 });
}

export function showProduct(_id) {
	return Product.findOne({ _id }, { _id: 0, __v: 0, hide: 0 });
}

export function editCustomer({ name, surname, phone, email, observations }, _id) {
	return Promise.all([Customer.findOne({ phone }), Customer.findOne({ email })]).then(res => {
		if (res[0] ? res[0]._id !== _id : false) { throw Error('Phone already in database'); }
		if ((res[1] ? res[1]._id !== _id : false) && email) { throw Error('Email already in database'); }
	}).then(() => {
		return Customer.findById(_id).then(customer => {
			const update = {};

			if (customer.name !== name) { update.name = name.trim(); }
			if (customer.surname !== surname) { update.surname = surname.trim(); }
			if (customer.phone !== phone) { update.phone = phone.trim(); }
			if (customer.email !== email) { update.email = email.trim(); }
			if (customer.observations !== observations) { update.observations = observations.trim(); }

			return Customer.updateOne({ _id }, { $set: update });
		});
	}).then(() => ({ _id }));
}

export function editTicket({ services, products }, _id) {
	return Ticket.findById(_id).then(() => {
		return calculateTicket(services, products);
	}).then(res => {
		let update = {};

		update = { services: res[0], products: res[1], total: res[2] };

		return Ticket.updateOne({ _id }, { $set: update });
	}).then(() => ({ _id }));
}

export function editService({ name, price, tax }, _id) {
	return Promise.resolve().then(() => Service.findOne({ name })).then(res => {
		if (res ? res._id !== _id : false) { throw Error('Service name already in database'); }
	}).then(() => {
		return Service.findById(_id).then(service => {
			const update = {};

			if (service.name !== name) { update.name = name.trim(); }
			if (service.price !== price) { update.price = price; }
			if (service.tax !== tax) { update.tax = tax; }

			return Service.updateOne({ _id }, { $set: update });
		});
	}).then(() => ({ _id }));
}

export function editProduct({ name, price, tax }, _id) {
	return Promise.resolve().then(() => Product.findOne({ name })).then(res => {
		if (res ? res._id !== _id : false) { throw Error('Product name already in database'); }
	}).then(() => {
		return Product.findById(_id).then(product => {
			const update = {};

			if (product.name !== name) { update.name = name.trim(); }
			if (product.price !== price) { update.price = price; }
			if (product.tax !== tax) { update.tax = tax; }

			return Product.updateOne({ _id }, { $set: update });
		});
	}).then(() => ({ _id }));
}
