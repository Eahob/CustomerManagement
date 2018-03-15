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
            //filter.total={}
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
            if (pricemax) filter.price['$gte'] = pricemin
            if (pricemin) filter.price['$lte'] = pricemax
        }
        if (name) filter.name = { $regex: new RegExp(name, 'i') }

        return Service.find(filter)
    },
    findProductsBy(pricemin, pricemax, name) {
        const filter = {}

        if (pricemax || pricemin) {
            filter.price = {}
            if (pricemin) filter.price['$gte'] = pricemin
            if (pricemax) filter.price['$lte'] = pricemax
        }
        if (name) filter.name = { $regex: new RegExp(name, 'i') }

        return Product.find(filter)
    }
}
