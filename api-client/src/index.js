const rp = require('request-promise')

const api = {
    _baseUrl() {
        return `${this.protocol}://${this.host}:${this.port}/api`
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
    showCustomer(id) {
        return this_call('get', 'customer/' + id)
    }
}

module.exports = api
