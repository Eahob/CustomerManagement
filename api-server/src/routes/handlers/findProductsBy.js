const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {pricemin, pricemax, name} = req.query
    logic.findProductsBy(pricemin, pricemax, name)
        .then(products => res.json(successResponse(products)))
        .catch(err => res.json(failResponse(err.message)))
}