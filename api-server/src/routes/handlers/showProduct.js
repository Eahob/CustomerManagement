const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.showProduct(req.params.id)
        .then(product => res.json(successResponse(product)))
        .catch(err => res.json(failResponse(err.message)))
}
