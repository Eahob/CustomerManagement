const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const { customer, services, products } = req.body
    logic.createTicket(customer, services, products)
        .then(ticket => res.json(successResponse({ id: ticket._id })))
        .catch(err => res.json(failResponse(err.message)))
}
