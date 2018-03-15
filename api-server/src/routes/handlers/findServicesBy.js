const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {pricemin, pricemax, name} = req.query
    logic.findServicesBy(pricemin, pricemax, name)
        .then(services => res.json(successResponse(services)))
        .catch(err => res.json(failResponse(err.message)))
}