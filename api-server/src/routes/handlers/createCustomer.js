const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {name, surname, phone, email, observations} = req.body
    logic.createCustomer(name, surname, phone, email, observations)
        .then(customer => res.json(successResponse(customer._id)))
        .catch(err => res.json(failResponse(err.message)))
}
