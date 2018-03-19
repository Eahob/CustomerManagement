const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    logic.deleteProduct(req.params.id)
        .then(product => res.json(successResponse()))
        .catch(err => res.json(failResponse(err.message)))
}
