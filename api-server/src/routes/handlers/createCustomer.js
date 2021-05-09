const { handleCreateQueryResponse } = require('../../utils/api-utils')
const { createCustomer } = require('../../logic')

module.exports = (req, res) => {
	const { name, surname, phone, email, observations } = req.body;
	handleCreateQueryResponse(res, createCustomer(name, surname, phone, email, observations));
}
