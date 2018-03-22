const { Customer, Ticket, Service, Product } = require('../models')

// to do: add pagination
module.exports = {
    findCustomersBy(name, surname, phone, email, observations) {
        const filter = {}

        if (name) filter.name = { $regex: new RegExp(name, 'i') }
        if (surname) filter.surname = { $regex: new RegExp(surname, 'i') }
        if (phone) filter.phone = { $regex: new RegExp(phone, 'i') }
        if (email) filter.email = { $regex: new RegExp(email, 'i') }
        if (observations) filter.observations = { $regex: new RegExp(observations, 'i') }

        return Customer.find(filter)
    },
    findTicketsBy(pricemin, pricemax, datemin, datemax) {
        const filter = {}

        if (pricemax || pricemin) {
            filter['total.withTax'] = {}
            if (pricemin) filter['total.withTax']['$gte'] = pricemin
            if (pricemax) filter['total.withTax']['$lte'] = pricemax
        }
        if (datemin || datemax) {
            filter.date = {}
            if (datemin) filter.date['$gte'] = datemin
            if (datemax) filter.date['$lte'] = datemax
        }

        return Ticket.find(filter)
    },
    findServicesBy(pricemin, pricemax, name) {
        const filter = {}

        if (pricemax || pricemin) {
            filter.price = {}
            if (pricemin) filter.price['$gte'] = parseFloat(pricemin)
            if (pricemax) filter.price['$lte'] = parseFloat(pricemax)
        }
        if (name) filter.name = { $regex: new RegExp(name, 'i') }

        return Service.find(filter)
    },
    findProductsBy(pricemin, pricemax, name) {
        const filter = {}

        if (pricemax || pricemin) {
            filter.price = {}
            if (pricemin) filter.price['$gte'] = parseFloat(pricemin)
            if (pricemax) filter.price['$lte'] = parseFloat(pricemax)
        }
        if (name) filter.name = { $regex: new RegExp(name, 'i') }

        return Product.find(filter)
    },
    createCustomer(name, surname, phone, email, observations = '') {
        customer = new Customer({ name, surname, phone, email, observations })
        return customer.save()
    },
    createService(name, price, tax) {
        service = new Service({ name, price, tax })
        return service.save()
    },
    createProduct(name, price, tax) {
        product = new Product({ name, price, tax })
        return product.save()
    },
    calculateTicket(services = [], products = []) {
        // services is an array. Each element has and id for the service and the quantity
        // products is an array. Each element has and id for the product and the quantity

        // In this case the price for products and services comes with tax, so the price adds directly to the total + tax

        return Promise.resolve().then(() => {
            if (!(services.length || products.length)) throw Error('services and products can not be empty at the same time')
        }).then(() => {
            return Promise.all([
                Service.find({ _id: { $in: services.map(service => service.id) } })
                    .then(_services => {
                        let withTax = 0
                        let withoutTax = 0
                        let copyServices = []
                        for (let i = 0; i < _services.length; i++) {
                            let index = services.findIndex(elm => {
                                return elm.id == _services[i]._id
                            })
                            copyServices.push({ service: _services[i]._id, price: _services[i].price, quantity: services[index].quantity, tax: _services[i].tax })
                            let subTotal = _services[i].price * services[index].quantity
                            withTax += subTotal
                            withoutTax += subTotal / (1 + _services[i].tax / 100)
                        }
                        return [withTax, withoutTax, copyServices]
                    }),
                Product.find({ _id: { $in: products.map(product => product.id) } })
                    .then(_products => {
                        let withTax = 0
                        let withoutTax = 0
                        let copyProducts = []
                        for (let i = 0; i < _products.length; i++) {
                            let index = products.findIndex(elm => {
                                return elm.id == _products[i]._id
                            })
                            copyProducts.push({ product: _products[i]._id, price: _products[i].price, quantity: products[index].quantity, tax: _products[i].tax })
                            let subTotal = _products[i].price * products[index].quantity
                            withTax += subTotal
                            withoutTax += subTotal / (1 + _products[i].tax / 100)
                        }
                        return [withTax, withoutTax, copyProducts]
                    })
            ])
        }).then(res => {
            const serv = res[0]
            const prod = res[1]
            let total = { withTax: (serv[0] + prod[0].toFixed(2)), withoutTax: (serv[1] + prod[1].toFixed(2)) }
            return [serv[2], prod[2], total]
        })
    },
    createTicket(customer, services, products) {
        return this.calculateTicket(services, products).then(res => {
            ticket = new Ticket({ date: Date(), customer, services: res[0], products: res[1], total: res[2] })
            return ticket.save()
        })
    },
    deleteTicket(_id) {
        return Ticket.deleteOne({ _id })
    },
    deleteCustomer(_id) {
        return Customer.deleteOne({ _id })
    },
    deleteService(_id) {
        return Service.deleteOne({ _id })
    },
    deleteProduct(_id) {
        return Product.deleteOne({ _id })
    },
    showCustomer(_id) {
        return Customer.findOne({ _id }, { _id: 0, __v: 0 })
    },
    showTicket(_id) {
        return Ticket.findOne({ _id }, { _id: 0, __v: 0 })
    },
    showService(_id) {
        return Service.findOne({ _id }, { _id: 0, __v: 0 })
    },
    showProduct(_id) {
        return Product.findOne({ _id }, { _id: 0, __v: 0 })
    },
    editCustomer(name, surname, phone, email, observations, _id) {
        return Customer.findById(_id).then(customer => {
            let update = {}
            if (customer.name != name) update.name = name.trim()
            if (customer.surname != surname) update.surname = surname.trim()
            if (customer.phone != phone) { update.phone = phone.trim() }
            if (customer.email != email) update.email = email.trim()
            if (customer.observations != observations) update.observations = observations.trim()
            return Customer.updateOne({ _id }, { $set: update })
        }).then(() => ({ _id }))
    },
    editTicket(customer, services, products, _id) {
        return Ticket.findById(_id).then(ticket => {
            return this.calculateTicket(services, products)
        }).then(res => {
            let update = {}
            update = { services: res[0], products: res[1], total: res[2] }
            return Ticket.updateOne({ _id }, { $set: update })
        }).then(() => ({ _id }))
    },
    editService(name, price, tax, _id) {
        return Service.findById(_id).then(service => {
            let update = {}
            if (service.name != name) update.name = name
            if (service.price != price) update.price = price
            if (service.tax != tax) update.tax = tax
            return Service.updateOne({ _id }, { $set: update })
        }).then(() => ({ _id }))
    },
    editProduct(name, price, tax, _id) {
        return Product.findById(_id).then(product => {
            let update = {}
            if (product.name != name) update.name = name
            if (product.price != price) update.price = price
            if (product.tax != tax) update.tax = tax
            return Product.updateOne({ _id }, { $set: update })
        }).then(() => ({ _id }))
    }
}
