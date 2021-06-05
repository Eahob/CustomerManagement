import { Customer, Ticket, Service, Product, User } from '../models';

export const createUser = async({ username, password }) => (new User({ username, password })).save();

export const login = async(username, password) => {
	const filter = {
		username: escape(username),
		password: escape(password)
	};
	const document = await User.findOne(filter, { _id: true });

	if (document) {
		return document._id;
	}

	throw Error('Username and/or password wrong');
};

export const findCustomersBy = ({ name, surname, phone, email, observations }) => {
	const filter = {};

	if (name) {
		filter.name = { $regex: new RegExp(name, 'i') };
	}

	if (surname) {
		filter.surname = { $regex: new RegExp(surname, 'i') };
	}

	if (phone) {
		filter.phone = { $regex: new RegExp(phone, 'i') };
	}

	if (email) {
		filter.email = { $regex: new RegExp(email, 'i') };
	}

	if (observations) {
		filter.observations = { $regex: new RegExp(observations, 'i') };
	}

	filter.hide = false;

	return Customer.find(filter, { __v: 0, hide: 0 });
};

export const findTicketsBy = ({ pricemin, pricemax, datemin, datemax, customerId }) => {
	const filter = {};

	if (pricemax || pricemin) {
		filter['total.withTax'] = {};
		if (pricemin) {
			filter['total.withTax']['$gte'] = pricemin;
		}

		if (pricemax) {
			filter['total.withTax']['$lte'] = pricemax;
		}
	}

	if (datemin || datemax) {
		filter.date = {};
		if (datemin) {
			filter.date['$gte'] = datemin;
		}

		if (datemax) {
			filter.date['$lte'] = datemax;
		}
	}

	if (customerId) {
		filter.customer = customerId;
	}

	return Ticket.find(filter, { __v: 0 }).sort('-date').populate('customer', 'name surname');
};

const findTaxable = model => async({ pricemin, pricemax, name }) => {
	const filter = {};

	if (pricemax || pricemin) {
		filter.price = {};
		if (pricemin) {
			filter.price['$gte'] = parseFloat(pricemin);
		}
		if (pricemax) {
			filter.price['$lte'] = parseFloat(pricemax);
		}
	}

	if (name) {
		filter.name = { $regex: name.toUpperCase() };
	}

	filter.hide = false;

	return model.find(filter, { __v: 0, hide: 0 });
};

export const findServicesBy = findTaxable(Service);
export const findProductsBy = findTaxable(Product);

export const createCustomer = ({ name, surname, phone, email, observations }) => {
	return new Customer({ name, surname, phone, email, observations }).save();
};

export const createService = ({ name, price, tax }) => new Service({ name, price, tax }).save();

export const createProduct = ({ name, price, tax }) => new Product({ name, price, tax }).save();

const expandTaxableList = taxableList => document => {
	const index = taxableList.findIndex(taxable => document._id.equals(taxable.id));

	return {
		document,
		quantity: taxableList[index].quantity
	};
};

const calculateTax = async(model, taxableList) => {
	const ONE_HUNDREDTH = 0.01;
	const taxableIdList = taxableList.map(taxable => taxable.id);
	const documents = await model.find({ _id: { $in: taxableIdList } });

	return documents
		.map(expandTaxableList(taxableList))
		.reduce(({ withTax, withoutTax, description }, { document, quantity }) => {
			const taxable = document._id;
			const price = document.price;
			const tax = document.tax;
			const subTotal = price * quantity;
			let preTax = tax * ONE_HUNDREDTH;
			const subTotalTax = ++preTax * subTotal;

			description.push({ taxable, price, quantity, tax });

			return {
				withTax: withTax + subTotalTax,
				withoutTax: withoutTax + subTotal,
				description
			};
		}, {
			withTax: 0,
			withoutTax: 0,
			description: []
		});
};

const calculateTicket = async(services = [], products = []) => {
	// services is an array. Each element has and id for the service and the quantity
	// products is an array. Each element has and id for the product and the quantity

	const [servicesResult, productResult] = await Promise.all([
		calculateTax(Service, services),
		calculateTax(Product, products)
	]);
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
};

export const createTicket = async({ customer, servicesList, productsList }) => {
	const { services, products, total } = await calculateTicket(servicesList, productsList);

	return new Ticket({ customer, services, products, total }).save();
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
	.populate('services.taxable', 'name')
	.populate('products.taxable', 'name');

const editDocument = (model, parseData) => async(data, _id) => {
	if (!_id) {
		throw new Error('Need id to edit');
	}

	const document = await model.findById(_id);
	const newValues = await parseData(data);

	for (const [key, value] of Object.entries(newValues)) {
		if (value !== undefined) {
			document[key] = value;
		}
	}

	await document.save();

	return { _id };
};

const parseTicketData = async({ servicesList, productsList }) => await calculateTicket(servicesList, productsList);
const parseTaxableData = ({ name, price, tax }) => ({ name, price, tax });
const parseCustomerData = ({ name, surname, phone, email, observations }) => (
	{ name, surname, phone, email, observations }
);

export const editCustomer = editDocument(Customer, parseCustomerData);
export const editTicket = editDocument(Ticket, parseTicketData);
export const editService = editDocument(Service, parseTaxableData);
export const editProduct = editDocument(Product, parseTaxableData);
