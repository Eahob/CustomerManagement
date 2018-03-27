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
    login: function login(username, password) {
        return this._call('post', 'login', { username: username, password: password });
    },
    showCustomersBy: function showCustomersBy(token, name, surname, phone, email, observations) {
        return this._call('get', 'customers', undefined, { name: name, surname: surname, phone: phone, email: email, observations: observations }, token);
    },
    showTicketsBy: function showTicketsBy(token, pricemin, pricemax, datemin, datemax, customerId) {
        return this._call('get', 'tickets', undefined, { pricemin: pricemin, pricemax: pricemax, datemin: datemin, datemax: datemax, customerId: customerId }, token);
    },
    showServicesBy: function showServicesBy(token, pricemin, pricemax, name) {
        return this._call('get', 'services', undefined, { pricemin: pricemin, pricemax: pricemax, name: name }, token);
    },
    showProductsBy: function showProductsBy(token, pricemin, pricemax, name) {
        return this._call('get', 'products', undefined, { pricemin: pricemin, pricemax: pricemax, name: name }, token);
    },
    createCustomer: function createCustomer(name, surname, phone, email, observations, token) {
        return this._call('post', 'customer', { name: name, surname: surname, phone: phone, email: email, observations: observations }, token);
    },
    createTicket: function createTicket(customer, services, products, token) {
        return this._call('post', 'ticket', { customer: customer, services: services, products: products }, token);
    },
    createService: function createService(name, price, tax, token) {
        return this._call('post', 'service', { name: name, price: price, tax: tax }, token);
    },
    createProduct: function createProduct(name, price, tax, token) {
        return this._call('post', 'product', { name: name, price: price, tax: tax }, token);
    },
    deleteCustomer: function deleteCustomer(id, token) {
        return this._call('delete', 'customer/' + id, token);
    },
    deleteTicket: function deleteTicket(id, token) {
        return this._call('delete', 'ticket/' + id, token);
    },
    deleteService: function deleteService(id, token) {
        return this._call('delete', 'service/' + id, token);
    },
    deleteProduct: function deleteProduct(id, token) {
        return this._call('delete', 'product/' + id, token);
    },
    showCustomer: function showCustomer(id, token) {
        return this._call('get', 'customer/' + id, token);
    },
    showTicket: function showTicket(id, token) {
        return this._call('get', 'ticket/' + id, token);
    },
    showService: function showService(id, token) {
        return this._call('get', 'service/' + id, token);
    },
    showProduct: function showProduct(id, token) {
        return this._call('get', 'product/' + id, token);
    },
    modifyCustomer: function modifyCustomer(name, surname, phone, email, observations, id, token) {
        return this._call('put', 'customer/' + id, { name: name, surname: surname, phone: phone, email: email, observations: observations }, token);
    },
    modifyTicket: function modifyTicket(customer, services, products, id, token) {
        return this._call('put', 'ticket/' + id, { customer: customer, services: services, products: products }, token);
    },
    modifyService: function modifyService(name, price, tax, id, token) {
        return this._call('put', 'service/' + id, { name: name, price: price, tax: tax }, token);
    },
    modifyProduct: function modifyProduct(name, price, tax, id, token) {
        return this._call('put', 'product/' + id, { name: name, price: price, tax: tax }, token);
    }
};

module.exports = api;
