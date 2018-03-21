const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.showTicket(req.params.id)
        .then(ticket => res.json(successResponse(ticket)))
        .catch(err => res.json(failResponse(err.message)))
}
