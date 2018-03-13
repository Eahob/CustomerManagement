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
    showCustomers(){
        return this._call('get', 'customers')
    },
    showTickets(){
        return this._call('get', 'tickets')
    },
    showServices(){
        return this._call('get', 'services')
    },
    showProducts(){
        return this._call('get', 'products')
    }
}

module.exports = api
