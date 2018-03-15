const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {pricemin, pricemax, datemin, datemax} = req.query
    logic.findTicketsBy(pricemin, pricemax, datemin, datemax)
        .then(tickets => res.json(successResponse(tickets)))
        .catch(err => res.json(failResponse(err.message)))
}
