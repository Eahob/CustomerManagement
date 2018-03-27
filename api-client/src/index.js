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
    login(username, password) {
        return this._call('post', 'login', { username, password })
    },
    showCustomersBy(token, name, surname, phone, email, observations) {
        return this._call('get', 'customers', undefined, { name, surname, phone, email, observations }, token)
    },
    showTicketsBy(token, pricemin, pricemax, datemin, datemax, customerId) {
        return this._call('get', 'tickets', undefined, { pricemin, pricemax, datemin, datemax, customerId }, token)
    },
    showServicesBy(token, pricemin, pricemax, name) {
        return this._call('get', 'services', undefined, { pricemin, pricemax, name }, token)
    },
    showProductsBy(token, pricemin, pricemax, name) {
        return this._call('get', 'products', undefined, { pricemin, pricemax, name }, token)
    },
    createCustomer(name, surname, phone, email, observations, token) {
        return this._call('post', 'customer', { name, surname, phone, email, observations }, token)
    },
    createTicket(customer, services, products, token) {
        return this._call('post', 'ticket', { customer, services, products }, token)
    },
    createService(name, price, tax, token) {
        return this._call('post', 'service', { name, price, tax }, token)
    },
    createProduct(name, price, tax, token) {
        return this._call('post', 'product', { name, price, tax }, token)
    },
    deleteCustomer(id, token) {
        return this._call('delete', 'customer/' + id, token)
    },
    deleteTicket(id, token) {
        return this._call('delete', 'ticket/' + id, token)
    },
    deleteService(id, token) {
        return this._call('delete', 'service/' + id, token)
    },
    deleteProduct(id, token) {
        return this._call('delete', 'product/' + id, token)
    },
    showCustomer(id, token) {
        return this._call('get', 'customer/' + id, token)
    },
    showTicket(id, token) {
        return this._call('get', 'ticket/' + id, token)
    },
    showService(id, token) {
        return this._call('get', 'service/' + id, token)
    },
    showProduct(id, token) {
        return this._call('get', 'product/' + id, token)
    },
    modifyCustomer(name, surname, phone, email, observations, id, token) {
        return this._call('put', 'customer/' + id, { name, surname, phone, email, observations }, token)
    },
    modifyTicket(customer, services, products, id, token) {
        return this._call('put', 'ticket/' + id, { customer, services, products }, token)
    },
    modifyService(name, price, tax, id, token) {
        return this._call('put', 'service/' + id, { name, price, tax }, token)
    },
    modifyProduct(name, price, tax, id, token) {
        return this._call('put', 'product/' + id, { name, price, tax }, token)
    }
}

module.exports = api
