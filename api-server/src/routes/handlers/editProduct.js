const { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const { name, price, tax } = req.body
    logic.editProduct(name, price, tax, req.params.id)
        .then(product => res.json(successResponse({ id: product._id })))
        .catch(err => res.json(failResponse(err.message)))
}
