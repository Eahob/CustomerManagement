const rp = require('request-promise')

const api = {
    _baseUrl() {
        return `${this.protocol}://${this.host}${this.port ? ':' + this.port : ''}/api`
    },
    _call(method, path, body, query, token) {
        const options = {
            method,
            uri: `${this._baseUrl()}/${path}`,
            json: true
        }

        if (query) options.qs = query

        if (body) options.body = body

        if (token) options.headers = { authorization: `Bearer ${token}` }

        return rp(options)
    },
    showCustomersBy(name, surname, phone, email, observations) {
        return this._call('get', 'customers', undefined, { name, surname, phone, email, observations })
    },
    showTicketsBy(pricemin, pricemax, datemin, datemax) {
        return this._call('get', 'tickets', undefined, { pricemin, pricemax, datemin, datemax })
    },
    showServicesBy(pricemin, pricemax, name) {
        return this._call('get', 'services', undefined, { pricemin, pricemax, name })
    },
    showProductsBy(pricemin, pricemax, name) {
        return this._call('get', 'products', undefined, { pricemin, pricemax, name })
    },
    createCustomer(name, surname, phone, email, observations) {
        return this._call('post', 'customer', { name, surname, phone, email, observations })
    },
    createTicket(customer, services, products) {
        return this._call('post', 'ticket', { customer, services, products })
    },
    createService(name, price, tax) {
        return this._call('post', 'service', { name, price, tax })
    },
    createProduct(name, price, tax) {
        return this._call('post', 'product', { name, price, tax })
    },
    deleteCustomer(id) {
        return this._call('delete', 'customer/' + id)
    },
    deleteTicket(id) {
        return this._call('delete', 'ticket/' + id)
    },
    deleteService(id) {
        return this._call('delete', 'service/' + id)
    },
    deleteProduct(id) {
        return this._call('delete', 'product/' + id)
    },
    showCustomer(id) {
        return this._call('get', 'customer/' + id)
    },
    showTicket(id) {
        return this._call('get', 'ticket/' + id)
    },
    showService(id) {
        return this._call('get', 'service/' + id)
    },
    showProduct(id) {
        return this._call('get', 'product/' + id)
    },
    modifyCustomer(name, surname, phone, email, observations, id) {
        return this._call('put', 'customer/' + id, { name, surname, phone, email, observations })
    },
    modifyTicket(customer, services, products, id) {
        return this._call('put', 'ticket/' + id, { customer, services, products })
    },
    modifyService(name, price, tax, id) {
        return this._call('put', 'service/' + id, { name, price, tax })
    },
    modifyProduct(name, price, tax, id) {
        return this._call('put', 'product/' + id, { name, price, tax })
    }
}

module.exports = api
