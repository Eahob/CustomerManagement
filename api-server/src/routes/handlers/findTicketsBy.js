const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {pricemin, pricemax, datemin, datemax, customerId} = req.query
    logic.findTicketsBy(pricemin, pricemax, datemin, datemax, customerId)
        .then(tickets => res.json(successResponse(tickets)))
        .catch(err => res.json(failResponse(err.message)))
}
