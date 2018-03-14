const rp = require('request-promise')

const api = {
    _baseUrl() {
        return `${this.protocol}://${this.host}:${this.port}/api`
    },
    _call(method, path, body, token) {
        const options = {
            method,
            uri: `${this._baseUrl()}/${path}`,
            json: true
        }

        if (body) options.body = body

        if (token) options.headers = { authorization: `Bearer ${token}` }

        return rp(options)
    },
    showCustomers(query) {
        return this._call('get', 'customers' + (query ? '/?' + query : ''))
    },
    showTickets(query) {
        return this._call('get', 'tickets'+ (query ? '/?' + query : ''))
    },
    showServices(query) {
        return this._call('get', 'services'+ (query ? '/?' + query : ''))
    },
    showProducts(query) {
        return this._call('get', 'products'+ (query ? '/?' + query : ''))
    }
}

module.exports = api
