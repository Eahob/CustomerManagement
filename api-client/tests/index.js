require('dotenv').config()

const api = require('../src')
const assert = require('assert')

api.protocol = process.env.API_PROTOCOL
api.host = process.env.API_HOST
api.port = process.env.API_PORT

describe('api showCustomers', () => {
    it('should list', done => {
        api.showCustomers()
            .then(res => {
                assert.equal(res.status, 'OK', `results should be OK, but got error: ${res.error}`)

                assert(res.data && res.data.length > 0, 'should return data array')

                done()
            })
            .catch(done)
    })
})

describe('api showTickets', () => {
    it('should list', done => {
        api.showTickets()
            .then(res => {
                assert.equal(res.status, 'OK', `results should be OK, but got error: ${res.error}`)

                assert(res.data && res.data.length > 0, 'should return data array')

                done()
            })
            .catch(done)
    })
})

describe('api showServices', () => {
    it('should list', done => {
        api.showServices()
            .then(res => {
                assert.equal(res.status, 'OK', `results should be OK, but got error: ${res.error}`)

                assert(res.data && res.data.length > 0, 'should return data array')

                done()
            })
            .catch(done)
    })
})

describe('api showProducts', () => {
    it('should list', done => {
        api.showProducts()
            .then(res => {
                assert.equal(res.status, 'OK', `results should be OK, but got error: ${res.error}`)

                assert(res.data && res.data.length > 0, 'should return data array')

                done()
            })
            .catch(done)
    })
})