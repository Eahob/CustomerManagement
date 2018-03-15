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
        let query = { name, surname, phone, email, observations }
        return this._call('get', 'customers', undefined, query)
    },
    showTicketsBy(pricemin, pricemax, datemin, datemax) {
        let query = { pricemin, pricemax, datemin, datemax }
        return this._call('get', 'tickets', undefined, query)
    },
    showServicesBy(pricemin, pricemax, name) {
        let query = { pricemin, pricemax}
        return this._call('get', 'services', undefined, query)
    },
    showProductsBy(query) {
        let query = { pricemin, pricemax}
        return this._call('get', 'products', undefined, query)
    }
}

module.exports = api
