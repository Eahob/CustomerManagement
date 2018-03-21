const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.showCustomer(req.params.id)
        .then(customer => res.json(successResponse(customer)))
        .catch(err => res.json(failResponse(err.message)))
}
