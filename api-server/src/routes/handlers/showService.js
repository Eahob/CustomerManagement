const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.showService(req.params.id)
        .then(service => res.json(successResponse(service)))
        .catch(err => res.json(failResponse(err.message)))
}
