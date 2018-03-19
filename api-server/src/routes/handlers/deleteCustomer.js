const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.deleteCustomer(req.params.id)
        .then(customer => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
