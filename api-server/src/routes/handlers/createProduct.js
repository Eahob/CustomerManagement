const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {name, price, tax} = req.body
    logic.createProduct(name, price, tax)
        .then(product => res.json(successResponse(product._id)))
        .catch(err => res.json(failResponse(err.message)))
}
