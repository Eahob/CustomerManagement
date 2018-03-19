const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.deleteService(req.params.id)
        .then(service => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
