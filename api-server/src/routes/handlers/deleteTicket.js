const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.deleteTicket(req.params.id)
        .then(ticket => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
