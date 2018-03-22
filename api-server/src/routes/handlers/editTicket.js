const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const { customer, services, products } = req.body
    logic.editTicket(customer, services, products, req.params.id)
        .then(ticket => res.json(successResponse({ id: ticket._id })))
        .catch(err => res.json(failResponse(err.message)))
}
