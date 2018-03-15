const  { successResponse, failResponse } = require('../../utils/api-utils')
const logic = require('../../logic')

module.exports = (req, res) => {
    const {name, surname, phone, email, observations} = req.query
    logic.findCustomersBy(name, surname, phone, email, observations)
        .then(customers => res.json(successResponse(customers)))
        .catch(err => res.json(failResponse(err.message)))
}
