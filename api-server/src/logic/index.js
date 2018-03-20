const { Customer, Ticket, Service, Product } = require('../models')

module.exports = {
    findCustomersBy(name, surname, phone, email, observations) {
        // to do: add pagination
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
    createTicket(customer, services = [], products = []) {
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
            let total = { withTax: serv[0] + prod[0], withoutTax: serv[1] + prod[1] }
            ticket = new Ticket({ date: Date(), customer, services: serv[2], products: prod[2], total })
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
    showCustomer(_id){
        return Customer.findOne({_id})
    }
}
