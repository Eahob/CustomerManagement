'use strict';

var rp = require('request-promise');

var api = {
    _baseUrl: function _baseUrl() {
        return this.protocol + '://' + this.host + (this.port ? ':' + this.port : '') + '/api';
    },
    _call: function _call(method, path, body, query, token) {
        var options = {
            method: method,
            uri: this._baseUrl() + '/' + path,
            json: true
        };

        if (query) options.qs = query;

        if (body) options.body = body;

        if (token) options.headers = { authorization: 'Bearer ' + token };

        return rp(options);
    },
    showCustomersBy: function showCustomersBy(name, surname, phone, email, observations) {
        return this._call('get', 'customers', undefined, { name: name, surname: surname, phone: phone, email: email, observations: observations });
    },
    showTicketsBy: function showTicketsBy(pricemin, pricemax, datemin, datemax) {
        return this._call('get', 'tickets', undefined, { pricemin: pricemin, pricemax: pricemax, datemin: datemin, datemax: datemax });
    },
    showServicesBy: function showServicesBy(pricemin, pricemax, name) {
        return this._call('get', 'services', undefined, { pricemin: pricemin, pricemax: pricemax, name: name });
    },
    showProductsBy: function showProductsBy(pricemin, pricemax, name) {
        return this._call('get', 'products', undefined, { pricemin: pricemin, pricemax: pricemax, name: name });
    },
    createCustomer: function createCustomer(name, surname, phone, email, observations) {
        return this._call('post', 'customer', { name: name, surname: surname, phone: phone, email: email, observations: observations });
    },
    createTicket: function createTicket(customer, services, products) {
        return this._call('post', 'ticket', { customer: customer, services: services, products: products });
    },
    createService: function createService(name, price, tax) {
        return this._call('post', 'service', { name: name, price: price, tax: tax });
    },
    createProduct: function createProduct(name, price, tax) {
        return this._call('post', 'product', { name: name, price: price, tax: tax });
    },
    deleteCustomer: function deleteCustomer(id) {
        return this._call('delete', 'customer/' + id);
    },
    deleteTicket: function deleteTicket(id) {
        return this._call('delete', 'ticket/' + id);
    },
    deleteService: function deleteService(id) {
        return this._call('delete', 'service/' + id);
    },
    deleteProduct: function deleteProduct(id) {
        return this._call('delete', 'product/' + id);
    },
    showCustomer: function showCustomer(id) {
        return this._call('get', 'customer/' + id);
    },
    showTicket: function showTicket(id) {
        return this._call('get', 'ticket/' + id);
    },
    showService: function showService(id) {
        return this._call('get', 'service/' + id);
    },
    showProduct: function showProduct(id) {
        return this._call('get', 'product/' + id);
    },
    modifyCustomer: function modifyCustomer(name, surname, phone, email, observations, id) {
        return this._call('put', 'customer/' + id, { name: name, surname: surname, phone: phone, email: email, observations: observations });
    },
    modifyTicket: function modifyTicket(customer, services, products, id) {
        return this._call('put', 'ticket/' + id, { customer: customer, services: services, products: products });
    },
    modifyService: function modifyService(name, price, tax, id) {
        return this._call('put', 'service/' + id, { name: name, price: price, tax: tax });
    },
    modifyProduct: function modifyProduct(name, price, tax, id) {
        return this._call('put', 'product/' + id, { name: name, price: price, tax: tax });
    }
};

module.exports = api;
