const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const { name, price, tax } = req.body
    logic.editService(name, price, tax, req.params.id)
        .then(service => res.json(successResponse({ id: service._id })))
        .catch(err => res.json(failResponse(err.message)))
}
