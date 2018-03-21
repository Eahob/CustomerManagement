const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const { name, surname, phone, email, observations } = req.body
    logic.editCustomer(name, surname, phone, email, observations, req.params.id)
        .then(customer => res.json(successResponse({ id: customer._id })))
        .catch(err => res.json(failResponse(err.message)))
}
